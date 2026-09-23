import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Execute the initial upload's actual polling callbacks with controlled requests/timers.
// No DOM testing framework is installed in this project.
const source = readFileSync(new URL("../src/components/Surveys/Elements/ThreeDElement.tsx", import.meta.url), "utf8");
const ast = ts.createSourceFile("modal.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const callbacks = new Map();
function visit(node) {
  if (ts.isVariableDeclaration(node) && ["clearPolling", "pollForUploadedModel", "handleUploadModel"].includes(node.name.getText(ast))) {
    callbacks.set(node.name.getText(ast), node.initializer.getText(ast));
  }
  ts.forEachChild(node, visit);
}
visit(ast);
const code = ts.transpileModule([...callbacks].map(([name, value]) => `globalThis.${name} = ${value};`).join("\n"), {
  compilerOptions: { target: ts.ScriptTarget.ES2020 },
}).outputText;
const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };
function harness(responses, canvas, uploadResponse = { jobID: "job-1" }) {
  const timers = new Map();
  const state = { loading: true, complete: false, error: null, requests: [], refreshes: 0, actions: [], aborted: 0 };
  let timerID = 0;
  const context = {
    useCallback: (fn) => fn,
    FormData,
    canUpload3DModel: true, isLoading: false, isWaitingForModel: false,
    upload3DModel: () => ({
      abort: () => state.aborted++,
      unwrap: () => Promise.resolve(uploadResponse),
    }),
    operationRef: { current: 0 }, pollTimerRef: { current: null }, deadlineRef: { current: null },
    requestRef: { current: null }, stopProgressRef: { current: null },
    window: {
      setTimeout: (fn, delay) => { timers.set(++timerID, { fn, delay }); return timerID; },
      clearTimeout: (id) => timers.delete(id),
    },
    getModelJobStatus: (jobID, cached) => {
      state.requests.push({ jobID, cached });
      const response = responses.shift();
      return { abort: () => state.aborted++, unwrap: () => response instanceof Error ? Promise.reject(response) : Promise.resolve(response) };
    },
    qID: "question-1",
    refetchCanvas: async () => {
      state.refreshes++;
      return canvas ?? { data: { getSurveyCanvas: { questions: [{ questionID: "question-1", Model3D: { fileUrl: "new.glb" } }] } } };
    },
    dispatch: (action) => state.actions.push(action),
    setQuestion: (value) => ({ type: "question", value }),
    updateSelectedQuestion3DModel: (value) => ({ type: "model", value }),
    setIsWaitingForModel: (value) => { state.loading = value; },
    buildModelUrl: (model) => model.fileUrl,
    setOverrideUrl: (value) => { state.modelUrl = value; state.complete = true; },
    set3DModelModalOpen: (value) => ({ type: "modal", value }),
    showToast: {
      success: (value) => { state.toast = value; },
      error: (value) => { state.error = value; },
    },
  };
  vm.createContext(context);
  vm.runInContext(code, context);
  return { state, timers, upload: () => context.handleUploadModel(new File(["model"], "model.glb")), start: () => context.pollForUploadedModel("job-1"), stop: context.clearPolling,
    async tick(delay) {
      const entry = [...timers].find(([, timer]) => timer.delay === delay);
      assert.ok(entry, `Expected ${delay}ms timer`);
      timers.delete(entry[0]); entry[1].fn(); await flush();
    },
  };
}

test("pending/processing poll the job, then completion refreshes canvas once and selects model", async () => {
  const h = harness([{ status: "PENDING" }, { status: "PROCESSING" }, { status: "COMPLETED" }]);
  h.start(); await flush();
  assert.equal(h.state.refreshes, 0);
  await h.tick(1500);
  assert.equal(h.state.refreshes, 0);
  await h.tick(1500);
  assert.equal(h.state.refreshes, 1);
  assert.equal(h.state.actions.length, 3);
  assert.equal(h.state.complete, true);
  assert.equal(h.state.loading, false);
  assert.equal(h.state.modelUrl, "new.glb");
  assert.deepEqual(h.state.actions.at(-1), { type: "modal", value: false });
  assert.ok(h.state.requests.every(({ jobID, cached }) => jobID === "job-1" && cached === false));
  assert.equal(h.timers.size, 0);
});

for (const [errorCode, errorMessage, expected] of [
  ["MODEL_TRIANGLE_LIMIT_EXCEEDED", "internal detail", "This model exceeds the supported triangle limit. Reduce its mesh complexity and upload it again."],
  ["OTHER", "Invalid model geometry", "Invalid model geometry"],
  [null, null, "Failed to process the 3D model."],
]) test(`FAILED: ${errorCode ?? "fallback"}`, async () => {
  const h = harness([{ status: "FAILED", errorCode, errorMessage }]);
  h.start(); await flush();
  assert.equal(h.state.error, expected);
  assert.equal(h.state.loading, false);
  assert.equal(h.state.refreshes, 0);
  assert.equal(h.state.complete, false);
  assert.equal(h.timers.size, 0);
});

test("request failure reports unconfirmed status", async () => {
  const h = harness([new Error("network unavailable")]);
  h.start(); await flush();
  assert.match(h.state.error, /status could not be confirmed/);
  assert.equal(h.state.loading, false);
  assert.equal(h.timers.size, 0);
});

test("deadline stops pending polling", async () => {
  const h = harness([{ status: "PENDING" }]);
  h.start(); await flush(); await h.tick(45000);
  assert.match(h.state.error, /status could not be confirmed/);
  assert.equal(h.state.loading, false);
  assert.equal(h.timers.size, 0);
});

for (const outcome of ["timeout", "cleanup"]) test(`${outcome} aborts a hung request and ignores its late completion`, async () => {
  let resolve;
  const h = harness([new Promise((done) => { resolve = done; })]);
  h.start(); await flush();
  assert.equal(h.state.requests.length, 1);
  assert.equal([...h.timers.values()].filter(({ delay }) => delay === 1500).length, 0);
  if (outcome === "timeout") await h.tick(45000); else h.stop();
  assert.equal(h.state.aborted, 1);
  resolve({ status: "COMPLETED" }); await flush();
  assert.equal(h.state.refreshes, 0);
  assert.equal(h.state.complete, false);
  assert.equal(h.timers.size, 0);
});

test("canvas refresh error after completion does not claim processing failed", async () => {
  const h = harness([{ status: "COMPLETED" }], { error: { status: 500 } });
  h.start(); await flush();
  assert.match(h.state.error, /processing completed.*could not be loaded/);
  assert.equal(h.state.loading, false);
  assert.equal(h.state.complete, false);
  assert.equal(h.timers.size, 0);
});


test("upload response jobID is passed to job polling", async () => {
  const h = harness([{ status: "PENDING" }], undefined, { jobID: "uploaded-job" });
  assert.equal(await h.upload(), true);
  await flush();
  assert.equal(h.state.requests[0].jobID, "uploaded-job");
  assert.equal(h.state.loading, true);
  assert.equal(h.state.refreshes, 0);
  h.stop();
});

test("missing upload jobID reports unconfirmed status without polling", async () => {
  const h = harness([], undefined, {});
  await h.upload(); await flush();
  assert.match(h.state.error, /status could not be confirmed/);
  assert.equal(h.state.loading, false);
  assert.equal(h.state.requests.length, 0);
  assert.equal(h.timers.size, 0);
});

test("cleanup during upload prevents late response from starting polling", async () => {
  let resolve;
  const h = harness([], undefined, new Promise((done) => { resolve = done; }));
  const upload = h.upload();
  h.stop();
  resolve({ jobID: "late-job" });
  assert.equal(await upload, false);
  assert.equal(h.state.requests.length, 0);
  assert.equal(h.state.toast, undefined);
  assert.equal(h.state.aborted, 1);
});
