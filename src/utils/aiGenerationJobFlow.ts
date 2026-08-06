export type AIGenerationJob = {
  jobID: string;
  surveyID: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELED"
    | "TIMED_OUT";
  generatedCount?: number | null;
  errorMessage?: string | null;
};

type AIGenerationJobActions = {
  clearJobID: () => void;
  showFinalizing: () => void;
  refetchCanvas: () => Promise<unknown>;
  invalidateElements: () => void;
  markAIQuestionsAdded: () => void;
  hideOverlay: () => void;
  showGenerationError: (message: string) => void;
  showRefreshError: () => void;
};

export const getAIGenerationJobStatusPath = (jobID: string) =>
  `/s/generate/job/${jobID}`;

export const processAIGenerationJob = async (
  job: AIGenerationJob,
  actions: AIGenerationJobActions,
) => {
  if (job.status === "PENDING" || job.status === "PROCESSING") {
    return false;
  }

  actions.clearJobID();

  if (job.status === "COMPLETED") {
    actions.showFinalizing();

    try {
      await actions.refetchCanvas();
      actions.invalidateElements();
      actions.markAIQuestionsAdded();
    } catch {
      actions.showRefreshError();
    } finally {
      actions.hideOverlay();
    }

    return true;
  }

  actions.hideOverlay();
  actions.showGenerationError(
    job.errorMessage ||
      (job.status === "TIMED_OUT"
        ? "Survey generation timed out. Please try again."
        : "Survey generation failed. Please try again."),
  );

  return true;
};
