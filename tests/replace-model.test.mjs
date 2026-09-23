import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Execute the modal's actual polling callbacks with controlled requests/timers.
// No DOM testing framework is installed in this project.
const source = readFileSync(new URL("../src/components/Modals/Replace3DModelModal.tsx", import.meta.url), "utf8");
const ast = ts.createSourceFile("modal.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const callbacks = new Map();
function visit(node) {
  if (ts.isVariableDeclaration(node) && ["clearPolling", "pollForReplacedModel"].includes(node.name.getText(ast))) {
    callbacks.set(node.name.getText(ast), node.initializer.getText(ast));
  }
  ts.forEachChild(node, visit);
}
visit(ast);
const code = ts.transpileModule([...callbacks].map(([name, value]) => `globalThis.${name} = ${value};`).join("\n"), {
  compilerOptions: { target: ts.ScriptTarget.ES2020 },
}).outputText;
const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };
function harness(responses, canvas) {
  const timers = new Map();
  const state = { loading: true, complete: false, error: null, requests: [], refreshes: 0, actions: [], aborted: 0 };
  let timerID = 0;
  const context = {
    useCallback: (fn) => fn,
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
    questionID: "question-1",
    refetchCanvas: async () => {
      state.refreshes++;
      return canvas ?? { data: { getSurveyCanvas: { questions: [{ questionID: "question-1", Model3D: { fileUrl: "new.glb" } }] } } };
    },
    dispatch: (action) => state.actions.push(action),
    setQuestion: (value) => ({ type: "question", value }),
    updateSelectedQuestion3DModel: (value) => ({ type: "model", value }),
    setIsProcessingReplacement: (value) => { state.loading = value; },
    setProgress: (value) => { state.progress = value; },
    setIsReplacementComplete: (value) => { state.complete = value; },
    setError: (value) => { state.error = value; },
    showToast: { success: (value) => { state.toast = value; } },
  };
  vm.createContext(context);
  vm.runInContext(code, context);
  return { state, timers, start: () => context.pollForReplacedModel("job-1"), stop: context.clearPolling,
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
  assert.equal(h.state.actions.length, 2);
  assert.equal(h.state.complete, true);
  assert.equal(h.state.loading, false);
  assert.equal(h.state.progress, 100);
  assert.ok(h.state.requests.every(({ jobID, cached }) => jobID === "job-1" && cached === false));
  assert.equal(h.timers.size, 0);
});

for (const [errorCode, errorMessage, expected] of [
  ["MODEL_TRIANGLE_LIMIT_EXCEEDED", "internal detail", "This model exceeds the supported triangle limit. Reduce its mesh complexity and upload it again."],
  ["OTHER", "Invalid model geometry", "Invalid model geometry"],
  [null, null, "Failed to replace the model."],
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
  assert.match(h.state.error, /replacement completed.*could not be loaded/);
  assert.equal(h.state.loading, false);
  assert.equal(h.state.complete, false);
  assert.equal(h.timers.size, 0);
});
