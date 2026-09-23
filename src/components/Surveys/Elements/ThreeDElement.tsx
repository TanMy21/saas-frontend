import { useCallback, useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import {
  useLazyGetModelJobStatusQuery,
  useUpload3DModelMutation,
} from "../../../app/slices/elementApiSlice";
import {
  set3DModelModalOpen,
  setQuestion,
  updateSelectedQuestion3DModel,
} from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../../context/BuilderRefetchCanvas";
import useAuth from "../../../hooks/useAuth";
import { hasMinimumPlan } from "../../../utils/planLimits";
import { showToast } from "../../../utils/showToast";
import { ElementProps } from "../../../utils/types";
import FileUpload3D from "../../ModalComponents/FileUpload3D";
import Upload3DModelModal from "../../Modals/Upload3DModelModal";

import ThreeDMobileView from "./ThreeDMobileView";
import { ThreeDModelEmptyState } from "./ThreeDModelEmptyState";
import ThreeDView from "./ThreeDView";

const ThreeDElement = ({ qID, display, showQuestion }: ElementProps) => {
  const isOpen3DModel = useAppSelector(
    (state) => state.question.is3DModelModalOpen,
  );

  const dispatch = useAppDispatch();
  const refetchCanvas = useSurveyCanvasRefetch();
  const isMobile = display === "mobile";

  const [overrideUrl, setOverrideUrl] = useState<string | null>(null);
  const [isWaitingForModel, setIsWaitingForModel] = useState(false);

  const { can, tier = "FREE" } = useAuth();

  const [upload3DModel, { isLoading }] = useUpload3DModelMutation();
  const [getModelJobStatus] = useLazyGetModelJobStatusQuery();
  const pollTimerRef = useRef<number | null>(null);
  const deadlineRef = useRef<number | null>(null);
  const operationRef = useRef(0);
  const requestRef = useRef<{ abort: () => void } | null>(null);

  const clearPolling = useCallback(() => {
    operationRef.current += 1;
    if (pollTimerRef.current !== null) window.clearTimeout(pollTimerRef.current);
    if (deadlineRef.current !== null) window.clearTimeout(deadlineRef.current);
    pollTimerRef.current = null;
    deadlineRef.current = null;
    requestRef.current?.abort();
    requestRef.current = null;
  }, []);

  useEffect(() => {
    setIsWaitingForModel(false);
    return clearPolling;
  }, [clearPolling, qID, isOpen3DModel]);

  const hasQuestionEditPermission = can("UPDATE_QUESTION");
  const hasProfessionalPlan = hasMinimumPlan(tier, "PROFESSIONAL");
  const canUpload3DModel = hasQuestionEditPermission && hasProfessionalPlan;

  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const url = question?.Model3D?.fileUrl
    ? `${question.Model3D.fileUrl}?v=${question.Model3D.updatedAt}`
    : null;

  const viewerUrl = overrideUrl ?? url;

  const buildModelUrl = (model: { fileUrl: string; updatedAt?: string }) =>
    `${model.fileUrl}?v=${model.updatedAt ?? Date.now()}`;

  const pollForUploadedModel = useCallback(
    (jobID: string) => {
      const operation = operationRef.current;
      let completed = false;
      const statusUnknown =
        "Model status could not be confirmed. Please refresh to check the model before trying again.";
      const refreshError =
        "Model processing completed, but the updated model could not be loaded. Please refresh the canvas.";
      const finishWithError = (message: string) => {
        clearPolling();
        setIsWaitingForModel(false);
        dispatch(set3DModelModalOpen(false));
        showToast.error(message);
      };

      if (!jobID) {
        finishWithError(statusUnknown);
        return;
      }

      // A separate deadline also bounds requests that never settle.
      deadlineRef.current = window.setTimeout(() => {
        if (operation !== operationRef.current) return;
        finishWithError(completed ? refreshError : statusUnknown);
      }, 45000);

      const poll = async () => {
        try {
          const request = getModelJobStatus(jobID, false);
          requestRef.current = request;
          const job = await request.unwrap();
          if (operation !== operationRef.current) return;
          requestRef.current = null;

          if (job.status === "FAILED") {
            finishWithError(
              job.errorCode === "MODEL_TRIANGLE_LIMIT_EXCEEDED"
                ? "This model exceeds the supported triangle limit. Reduce its mesh complexity and upload it again."
                : job.errorMessage || "Failed to process the 3D model.",
            );
            return;
          }

          if (job.status === "COMPLETED") {
            completed = true;
            const result = await (refetchCanvas() as any);
            if (operation !== operationRef.current) return;
            const questions =
              result?.data?.getSurveyCanvas?.questions ??
              result?.data?.questions ??
              [];
            const updatedQuestion = questions.find(
              (item: any) => item.questionID === qID,
            );
            if (result?.error || !updatedQuestion?.Model3D?.fileUrl) {
              finishWithError(refreshError);
              return;
            }
            dispatch(setQuestion(updatedQuestion));
            dispatch(updateSelectedQuestion3DModel(updatedQuestion.Model3D));
            clearPolling();
            setOverrideUrl(buildModelUrl(updatedQuestion.Model3D));
            setIsWaitingForModel(false);
            dispatch(set3DModelModalOpen(false));
            showToast.success("3D model ready.");
            return;
          }

          if (job.status !== "PENDING" && job.status !== "PROCESSING") {
            finishWithError(statusUnknown);
            return;
          }
          // Schedule only after the preceding request finishes.
          pollTimerRef.current = window.setTimeout(() => void poll(), 1500);
        } catch {
          if (operation !== operationRef.current) return;
          finishWithError(completed ? refreshError : statusUnknown);
        }
      };
      void poll();
    },
    [clearPolling, dispatch, getModelJobStatus, qID, refetchCanvas],
  );

  const handleUploadModel = async (file: File) => {
    if (!canUpload3DModel || isLoading || isWaitingForModel || requestRef.current) {
      return false;
    }
    clearPolling();
    const operation = operationRef.current;
    const formData = new FormData();
    formData.append("modelFile", file);
    formData.append("name", file.name);

    try {
      const request = upload3DModel({
        formData,
        questionID: qID!,
      });
      requestRef.current = request;
      const response = await request.unwrap();
      if (operation !== operationRef.current) return false;
      requestRef.current = null;

      setIsWaitingForModel(true);
      showToast.success("Model uploaded. Processing 3D model...");
      pollForUploadedModel(response?.jobID);
      return true;
    } catch (error) {
      if (operation !== operationRef.current) return false;
      clearPolling();
      console.error("Upload failed:", error);
      showToast.error("Failed to upload 3D model.");
      return false;
    }
  };

  const handleUploadError = (message: string) => {
    console.error(message);
  };

  const handleCloseModal = () => {
    clearPolling();
    setIsWaitingForModel(false);
    refetchCanvas();
    dispatch(set3DModelModalOpen(false));
  };

  if (viewerUrl) {
    return (
      <Box component="div"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          m: "auto",
          width: "100%",
          minHeight: isMobile ? "680px" : "660px",
          zIndex: 20,
        }}
      >
        {isMobile ? (
          <ThreeDMobileView
            url={viewerUrl}
            display={display}
            showQuestion={showQuestion}
          />
        ) : (
          <ThreeDView
            url={viewerUrl}
            display={display}
            showQuestion={showQuestion}
          />
        )}
      </Box>
    );
  }

  if (isWaitingForModel) {
    return (
      <Box component="div"
        sx={{
          width: "100%",
          minHeight: isMobile ? "380px" : "700px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748B",
          fontWeight: 700,
        }}
      >
        Processing 3D model...
      </Box>
    );
  }

  return (
    <>
      <ThreeDModelEmptyState
        isMobile={isMobile}
        canUpload3DModel={canUpload3DModel}
        hasProfessionalPlan={hasProfessionalPlan}
        onUpload={() => dispatch(set3DModelModalOpen(true))}
      />

      {canUpload3DModel && (
        <Upload3DModelModal
          isOpen={isOpen3DModel}
          onClose={handleCloseModal}
          title="Upload 3D Model"
        >
          <FileUpload3D
            questionID={qID!}
            isUploading={isLoading}
            onUpload={handleUploadModel}
            onUploadError={handleUploadError}
          />
        </Upload3DModelModal>
      )}
    </>
  );
};
export default ThreeDElement;
