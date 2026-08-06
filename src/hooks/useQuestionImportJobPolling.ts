import { useEffect, useRef } from "react";

import { apiSlice } from "../app/api/apiSlice";
import { useGetQuestionImportJobStatusQuery } from "../app/slices/elementApiSlice";
import { setAiQuestionsJustAdded } from "../app/slices/generateSurveyQuestionSlice";
import { hideOverlay, showOverlay } from "../app/slices/overlaySlice";
import { setImportJobID } from "../app/slices/surveySlice";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";
import { showToast } from "../utils/showToast";

import { useToast } from "./useToast";

const useQuestionImportJobPolling = (refetchCanvas: () => Promise<unknown>) => {
  const dispatch = useAppDispatch();
  const handledJobIDRef = useRef<string | null>(null);
  const importJobID = useAppSelector(
    (state: RootState) => state.surveyBuilder.importJobID,
  );

  const {
    data: importJob,
    isError,
    error,
  } = useGetQuestionImportJobStatusQuery(importJobID!, {
    skip: !importJobID,
    pollingInterval: importJobID ? 2000 : 0,
  });

  useToast({
    isError,
    error,
    errorFallbackMessage: "Unable to check the question import status.",
  });

  useEffect(() => {
    if (!importJobID) return;

    dispatch(
      showOverlay({
        message: "Importing questions...",
        variant: "IMPORT",
      }),
    );
  }, [importJobID, dispatch]);

  useEffect(() => {
    if (!importJob || handledJobIDRef.current === importJob.jobID) return;

    if (importJob.status === "PENDING" || importJob.status === "PROCESSING") {
      return;
    }

    if (importJob.status === "COMPLETED") {
      handledJobIDRef.current = importJob.jobID;
      dispatch(setImportJobID(null));
      dispatch(
        showOverlay({
          message: "Finalizing your survey...",
          variant: "IMPORT",
        }),
      );

      void (async () => {
        try {
          await refetchCanvas();
          dispatch(apiSlice.util.invalidateTags(["Elements"]));
          dispatch(setAiQuestionsJustAdded());
          showToast.success("Questions imported successfully.");
        } catch (error) {
          console.error("Failed to refresh the imported questions:", error);
          showToast.error(
            "Questions were imported, but the survey could not be refreshed.",
          );
        } finally {
          dispatch(hideOverlay());
        }
      })();
      return;
    }

    if (
      importJob.status === "FAILED" ||
      importJob.status === "TIMED_OUT" ||
      importJob.status === "CANCELED" ||
      importJob.status === "CANCELLED"
    ) {
      handledJobIDRef.current = importJob.jobID;
      dispatch(setImportJobID(null));
      dispatch(hideOverlay());
      showToast.error(importJob.errorMessage || "Failed to import questions.");
    }
  }, [importJob, dispatch, refetchCanvas]);
};

export default useQuestionImportJobPolling;
