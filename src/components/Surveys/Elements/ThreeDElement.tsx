import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import { set3DModelModalOpen } from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../../context/BuilderRefetchCanvas";
import useAuth from "../../../hooks/useAuth";
import { hasMinimumPlan } from "../../../utils/planLimits";
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
  const [isReadyToView, setIsReadyToView] = useState(false);

  const { can, tier = "FREE" } = useAuth();

  const hasQuestionEditPermission = can("UPDATE_QUESTION");
  const hasProfessionalPlan = hasMinimumPlan(tier, "PROFESSIONAL");

  const canUpload3DModel = hasQuestionEditPermission && hasProfessionalPlan;

  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const hasModel = Boolean(question?.Model3D?.fileUrl);

  const url = question?.Model3D?.fileUrl
    ? `${question.Model3D.fileUrl}?v=${question.Model3D.updatedAt}`
    : null;

  /**
   * Keeps FileUpload3D's selection lifecycle available without duplicating file state here.
   */
  const handleFileSelect = (_file: File) => {
    // FileUpload3D owns validation and upload progress for the selected file.
  };

  /**
   * Immediately switches the viewer to the newly uploaded model URL.
   */
  const handleUploadSuccess = (model: { fileUrl?: string }) => {
    setOverrideUrl(model?.fileUrl ?? null);
    setIsReadyToView(true);

    refetchCanvas();
    dispatch(set3DModelModalOpen(false));
  };

  /**
   * Logs upload failures while FileUpload3D handles the user-facing error UI.
   */
  const handleUploadError = (message: string) => {
    console.error(message);
  };

  /**
   * Closes the upload modal and refreshes the canvas to keep the model state current.
   */
  const handleCloseModal = () => {
    refetchCanvas();
    dispatch(set3DModelModalOpen(false));
  };

  /**
   * Marks the element ready whenever the selected question receives a persisted model.
   */
  useEffect(() => {
    setIsReadyToView(hasModel);
  }, [hasModel]);

  if (isReadyToView && (overrideUrl || url)) {
    return (
      <Box
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
            url={overrideUrl ?? url!}
            display={display}
            showQuestion={showQuestion}
          />
        ) : (
          <ThreeDView
            url={overrideUrl ?? url!}
            display={display}
            showQuestion={showQuestion}
          />
        )}
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
            onFileSelect={handleFileSelect}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </Upload3DModelModal>
      )}
    </>
  );
};

export default ThreeDElement;
