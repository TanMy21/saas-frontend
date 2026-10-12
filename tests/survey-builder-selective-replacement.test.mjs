import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const assistantPath = "../src/components/Surveys/SurveyBuilderAssistant/";
const sources = {
  parts: readFileSync(new URL(assistantPath + "ui/AssistantMessageParts.tsx", import.meta.url), "utf8"),
  provider: readFileSync(new URL(assistantPath + "SurveyBuilderAssistantProvider.tsx", import.meta.url), "utf8"),
  lifecycle: readFileSync(new URL(assistantPath + "surveyBuilderAssistantLifecycle.ts", import.meta.url), "utf8"),
  adapters: readFileSync(new URL(assistantPath + "SurveyBuilderAssistantAdapters.ts", import.meta.url), "utf8"),
};

function loadModule(source, mocks = {}) {
  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, {
    module,
    exports: module.exports,
    require: (id) => Object.hasOwn(mocks, id) ? mocks[id] : require(id),
  });
  return module.exports;
}

const lifecycle = loadModule(sources.lifecycle);
const { parseAssistantApiError } = loadModule(sources.adapters);
let assistantState;
const { default: AssistantMessageParts } = loadModule(sources.parts, {
  "../SurveyBuilderAssistantContext": { useSurveyBuilderAssistant: () => assistantState },
  "../surveyBuilderAssistantLifecycle": lifecycle,
});

function question(id, text) {
  return {
    draftQuestionID: id, text, description: null, type: "TEXT",
    required: false, options: [], iatConfig: null,
  };
}

const questions = [
  question("draft-two", "New wording for question two"),
  question("draft-seven", "New wording for question seven"),
];
const targets = [
  { questionRef: "question_ref_7", questionID: "old-seven", draftQuestionID: "draft-seven",
    previousPosition: 7, previousOrder: 70, text: "Old wording for question seven" },
  { questionRef: "question_ref_2", questionID: "old-two", draftQuestionID: "draft-two",
    previousPosition: 2, previousOrder: 20, text: "Old wording for question two" },
];

function thread(mode = "REPLACE_SELECTED", version = 4) {
  return {
    threadID: "thread-1", status: "ACTIVE", stage: "REVIEW",
    draft: {
      version, commitMode: mode, questions,
      replacementProposal: { replacedQuestionCount: 2, targets },
    },
  };
}

function render(parts, overrides = {}) {
  assistantState = {
    thread: thread(), isCommitting: false, isGenerating: false,
    commitDraft: async () => {}, ...overrides,
  };
  const html = renderToStaticMarkup(React.createElement(AssistantMessageParts, {
    message: { messageID: "message-1", content: { parts } },
  }));
  const text = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return { html, text };
}

const preview = (overrides = {}) => ({
  type: "survey-preview", draftVersion: 4, commitMode: "REPLACE_SELECTED",
  replacedQuestionCount: 2, removesFlowLogic: true, flowLogicScope: "SELECTED",
  title: "Survey", questions, replacementTargets: targets, ...overrides,
});
const approval = (mode = "REPLACE_SELECTED", overrides = {}) => ({
  type: "approval-controls", draftVersion: 4, commitMode: mode,
  questionCount: 2, replacedQuestionCount: 2, ...overrides,
});

test("selective preview matches targets by draft ID and shows original positions and before/after wording", () => {
  const { html, text } = render([preview()]);
  assert.match(text, /Selected question replacements/);
  assert.match(text, /2\. Original: Old wording for question two Replacement New wording for question two/);
  assert.match(text, /7\. Original: Old wording for question seven Replacement New wording for question seven/);
  assert.match(text, /Other questions stay unchanged/);
  assert.match(text, /Flow rules referencing the selected questions will be removed/);
  assert.doesNotMatch(html, /question_ref_|old-seven|old-two|draft-two|draft-seven/);
});

test("single replacement uses singular copy and does not invent a position if target metadata is absent", () => {
  const { text } = render([preview({
    questions: [questions[0]], replacedQuestionCount: 1, replacementTargets: [],
  })]);
  assert.match(text, /1 selected question will be replaced at its current position/);
  assert.match(text, /\?\. Original: Original question unavailable/);
});

test("append preview keeps its original numbering and has no replacement notice", () => {
  const { text } = render([preview({ commitMode: "APPEND" })]);
  assert.match(text, /1\. New wording for question two/);
  assert.match(text, /2\. New wording for question seven/);
  assert.doesNotMatch(text, /Original:|Replacement|Flow rules/);
});

test("replace-all preview preserves full-replacement copy and respects the flow-warning flag", () => {
  const withWarning = render([preview({ commitMode: "REPLACE_ALL" })]).text;
  assert.match(withWarning, /This is a complete replacement preview/);
  assert.match(withWarning, /2 current questions will be removed and 2 replacement questions will be created/);
  assert.match(withWarning, /Existing flow logic tied to the current questions/);
  const withoutWarning = render([preview({ commitMode: "REPLACE_ALL", removesFlowLogic: false })]).text;
  assert.doesNotMatch(withoutWarning, /Existing flow logic/);
});

test("selective approval labels the destructive action and its affected scope", () => {
  const { text } = render([approval()]);
  assert.match(text, /Replace these selected questions\?/);
  assert.match(text, /Replace 2 selected questions/);
  assert.match(text, /their original positions/);
  assert.doesNotMatch(text, /Create 2 questions|Replace all current questions/);
  assert.match(render([approval()], { isCommitting: true }).text, /Replacing questions…/);
});

for (const [mode, title, button] of [
  ["APPEND", "Ready to create these questions?", "Create 2 questions"],
  ["REPLACE_ALL", "Replace all current questions?", "Replace with 2 questions"],
  ["REORDER", "Ready to apply this question order?", "Apply reorder"],
]) {
  test(`${mode} approval retains its existing labels`, () => {
    const { text } = render([approval(mode)], { thread: thread(mode) });
    assert.ok(text.includes(title));
    assert.ok(text.includes(button));
  });
}

test("an older selective preview cannot be approved against a newer draft", () => {
  const { html } = render([approval()], { thread: thread("REPLACE_SELECTED", 5) });
  assert.match(html, /<button[^>]*disabled=""/);
});

test("committed and archived threads retain their confirmation and read-only states", () => {
  assert.match(render([approval()], {
    thread: { ...thread(), stage: "COMMITTED" },
  }).text, /The approved survey changes were applied/);
  assert.match(render([approval()], {
    thread: { ...thread(), status: "ARCHIVED" },
  }).text, /This previous chat is read-only/);
});

// Exercise the real commit callback, as the existing polling tests do,
// with controlled mutation results and refresh callbacks.
const providerAst = ts.createSourceFile("provider.tsx", sources.provider, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let initializer;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(providerAst) === "commitDraft") {
    initializer = node.initializer.getText(providerAst);
  }
  ts.forEachChild(node, visit);
}
visit(providerAst);
assert.ok(initializer, "Commit callback must exist");
const callbackCode = ts.transpileModule(`globalThis.commitDraft = ${initializer};`, {
  compilerOptions: { target: ts.ScriptTarget.ES2020 },
}).outputText;

function commitHarness(results, options = {}) {
  const state = { requests: [], errors: [], refreshes: 0, canvasRefreshes: 0, actions: [], keys: 0 };
  const context = {
    ...lifecycle, useCallback: (fn) => fn, parseAssistantApiError,
    thread: thread(options.mode ?? "REPLACE_SELECTED"),
    pendingCommitRef: { current: null },
    isCommitting: false, isGenerating: false, isSending: false,
    assistantSurveyID: "survey-1",
    crypto: { randomUUID: () => `request-${++state.keys}` },
    setErrorMessage: (message) => state.errors.push(message),
    commitAssistantDraft: (request) => {
      state.requests.push(request);
      const result = results.shift();
      return { unwrap: () => result?.error ? Promise.reject(result.error) : Promise.resolve(result) };
    },
    refreshThreadAndMessages: async () => {
      state.refreshes++;
      if (options.refreshFails) throw new Error("Refresh failed");
    },
    refetchCanvas: async () => { state.canvasRefreshes++; },
    dispatch: (action) => state.actions.push(action),
    setAiQuestionsJustAdded: () => ({ type: "questions-added" }),
  };
  vm.createContext(context);
  vm.runInContext(callbackCode, context);
  return { state, context, commit: () => context.commitDraft(4) };
}

test("successful selective commit uses the existing API payload and refreshes the canvas", async () => {
  const h = commitHarness([{ result: { mode: "REPLACE_SELECTED" } }]);
  await h.commit();
  assert.deepEqual(JSON.parse(JSON.stringify(h.state.requests)), [{
    surveyID: "survey-1", threadID: "thread-1", expectedVersion: 4, idempotencyKey: "request-1",
  }]);
  assert.equal(h.context.pendingCommitRef.current, null);
  assert.equal(h.state.refreshes, 1);
  assert.equal(h.state.canvasRefreshes, 1);
  assert.equal(h.state.actions.length, 1);
});

for (const refreshFails of [false, true]) {
  test(`stale selective preview clears the pending request and asks for a fresh preview (refresh failure=${refreshFails})`, async () => {
    const h = commitHarness([{ error: {
      status: 409, data: { code: "STALE_SELECTED_REPLACEMENT_PROPOSAL", message: "The survey changed." },
    } }], { refreshFails });
    await h.commit();
    assert.equal(h.context.pendingCommitRef.current, null);
    assert.equal(h.state.refreshes, 1);
    assert.equal(h.state.canvasRefreshes, 0);
    assert.equal(h.state.actions.length, 0);
    assert.match(h.state.errors.at(-1), /Ask the assistant for a new preview before approving/);
  });
}

test("existing draft-version conflicts still clear the pending request and refresh", async () => {
  const h = commitHarness([{ error: {
    status: 409, data: { code: "SURVEY_BUILDER_DRAFT_VERSION_CONFLICT", message: "The draft version changed." },
  } }], { mode: "APPEND" });
  await h.commit();
  assert.equal(h.context.pendingCommitRef.current, null);
  assert.equal(h.state.refreshes, 1);
  assert.equal(h.state.errors.at(-1), "The draft version changed.");
});

test("transient failures retain the idempotency key for a safe retry", async () => {
  const h = commitHarness([{ error: { status: "FETCH_ERROR", error: "Connection lost" } }, {}]);
  await h.commit();
  assert.ok(h.context.pendingCommitRef.current);
  await h.commit();
  assert.equal(h.state.requests[0].idempotencyKey, h.state.requests[1].idempotencyKey);
  assert.equal(h.state.keys, 1);
});

test("missing error messages use copy that covers all survey changes", async () => {
  const h = commitHarness([{ error: {} }]);
  await h.commit();
  assert.equal(h.state.errors.at(-1), "The survey changes could not be applied.");
});
