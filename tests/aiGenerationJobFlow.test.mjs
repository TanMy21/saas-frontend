import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import ts from "typescript";

const source = await readFile(
  new URL("../src/utils/aiGenerationJobFlow.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const flow = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("completed AI generation polls status, removes loader, and displays generated questions", async () => {
  const requestedEndpoints = [];
  let generationJobID = "job-123";
  let loaderVisible = true;
  let questions = [];
  let refreshCount = 0;

  const getStatus = async (jobID) => {
    requestedEndpoints.push(flow.getAIGenerationJobStatusPath(jobID));
    return {
      jobID,
      surveyID: "survey-123",
      status: "COMPLETED",
    };
  };

  const job = await getStatus(generationJobID);
  await flow.processAIGenerationJob(job, {
    clearJobID: () => {
      generationJobID = null;
    },
    showFinalizing: () => {
      loaderVisible = true;
    },
    refetchCanvas: async () => {
      refreshCount += 1;
      questions = ["How satisfied are you with the product?"];
    },
    invalidateElements: () => undefined,
    markAIQuestionsAdded: () => undefined,
    hideOverlay: () => {
      loaderVisible = false;
    },
    showGenerationError: () => assert.fail("generation should not fail"),
    showRefreshError: () => assert.fail("canvas refresh should not fail"),
  });

  assert.deepEqual(requestedEndpoints, ["/s/generate/job/job-123"]);
  assert.equal(generationJobID, null);
  assert.equal(refreshCount, 1);
  assert.equal(loaderVisible, false);
  assert.deepEqual(questions, ["How satisfied are you with the product?"]);
});
