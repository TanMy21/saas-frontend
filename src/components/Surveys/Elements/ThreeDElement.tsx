import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import { useUpload3DModelMutation } from "../../../app/slices/elementApiSlice";
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

  const [upload3DModel, { isLoading, isError, error }] =
    useUpload3DModelMutation();

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

  const handleUploadModel = async (file: File) => {
    const formData = new FormData();
    formData.append("modelFile", file);
    formData.append("name", file.name);

    try {
      await upload3DModel({
        formData,
        questionID: qID!,
      }).unwrap();

      setIsWaitingForModel(true);
      showToast.success("Model uploaded. Processing 3D model...");
      return true;
    } catch (error) {
      console.error("Upload failed:", error);
      showToast.error("Failed to upload 3D model.");
      return false;
    }
  };

  const handleUploadError = (message: string) => {
    console.error(message);
  };

  const handleCloseModal = () => {
    refetchCanvas();
    dispatch(set3DModelModalOpen(false));
  };

  useEffect(() => {
    if (!isWaitingForModel || viewerUrl) return;

    let attempts = 0;
    const maxAttempts = 30;

    const intervalID = window.setInterval(() => {
      attempts += 1;

      const refetchResult = refetchCanvas() as any;

      refetchResult
        ?.then?.((result: any) => {
          const questions =
            result?.data?.getSurveyCanvas?.questions ??
            result?.data?.questions ??
            [];

          const updatedQuestion = questions.find(
            (item: any) => item.questionID === qID,
          );

          const model = updatedQuestion?.Model3D;

          if (model?.fileUrl) {
            dispatch(setQuestion(updatedQuestion));
            dispatch(updateSelectedQuestion3DModel(model));
            setOverrideUrl(buildModelUrl(model));
            setIsWaitingForModel(false);
            dispatch(set3DModelModalOpen(false));
            showToast.success("3D model ready.");
            window.clearInterval(intervalID);
          }

          if (attempts >= maxAttempts) {
            setIsWaitingForModel(false);
            dispatch(set3DModelModalOpen(false));
            showToast.info(
              "Model is still processing. Refresh in a moment if it does not appear.",
            );
            window.clearInterval(intervalID);
          }
        })
        ?.catch?.((pollError: unknown) => {
          console.error("Failed to refresh 3D model status:", pollError);

          if (attempts >= maxAttempts) {
            setIsWaitingForModel(false);
            dispatch(set3DModelModalOpen(false));
            showToast.info(
              "Model is still processing. Refresh in a moment if it does not appear.",
            );
            window.clearInterval(intervalID);
          }
        });
    }, 1500);

    return () => window.clearInterval(intervalID);
  }, [isWaitingForModel, viewerUrl, refetchCanvas, dispatch, qID]);

  useEffect(() => {
    if (!isError) return;

    console.error("3D upload mutation error:", error);
    showToast.error("Failed to upload 3D model.");
  }, [isError, error]);

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
