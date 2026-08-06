import { useEffect, useRef } from "react";

import { apiSlice } from "../app/api/apiSlice";
import { setAiQuestionsJustAdded } from "../app/slices/generateSurveyQuestionSlice";
import { hideOverlay, showOverlay } from "../app/slices/overlaySlice";
import { useGetAIGenerationJobStatusQuery } from "../app/slices/surveysApiSlice";
import { setGenerationJobID } from "../app/slices/surveySlice";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";
import { processAIGenerationJob } from "../utils/aiGenerationJobFlow";
import { showToast } from "../utils/showToast";

import { useToast } from "./useToast";

const useAIGenerationJobPolling = (refetchCanvas: () => Promise<unknown>) => {
  const dispatch = useAppDispatch();
  const handledJobIDRef = useRef<string | null>(null);
  const generationJobID = useAppSelector(
    (state: RootState) => state.surveyBuilder.generationJobID,
  );

  const {
    data: generationJob,
    isError,
    error,
  } = useGetAIGenerationJobStatusQuery(generationJobID!, {
    skip: !generationJobID,
    pollingInterval: generationJobID ? 5000 : 0,
  });

  useToast({
    isError,
    error,
    errorFallbackMessage: "Unable to check the survey generation status.",
  });

  useEffect(() => {
    if (!generationJobID) return;

    dispatch(
      showOverlay({
        message: "Generating relevant questions...",
        variant: "GENERATE",
      }),
    );
  }, [generationJobID, dispatch]);

  useEffect(() => {
    if (!generationJob || handledJobIDRef.current === generationJob.jobID) {
      return;
    }

    if (
      generationJob.status === "PENDING" ||
      generationJob.status === "PROCESSING"
    ) {
      return;
    }

    handledJobIDRef.current = generationJob.jobID;

    void processAIGenerationJob(generationJob, {
      clearJobID: () => dispatch(setGenerationJobID(null)),
      showFinalizing: () =>
        dispatch(
          showOverlay({
            message: "Finalizing your survey...",
            variant: "GENERATE",
          }),
        ),
      refetchCanvas,
      invalidateElements: () =>
        dispatch(apiSlice.util.invalidateTags(["Elements"])),
      markAIQuestionsAdded: () => dispatch(setAiQuestionsJustAdded()),
      hideOverlay: () => dispatch(hideOverlay()),
      showGenerationError: (message) => showToast.error(message),
      showRefreshError: () => {
        console.error("Failed to refresh the generated survey");
        showToast.error(
          "The survey was generated, but the questions could not be refreshed.",
        );
      },
    });
  }, [generationJob, dispatch, refetchCanvas]);
};

export default useAIGenerationJobPolling;
