import { useEffect, useState } from "react";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

import { set3DModelModalOpen } from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../../context/BuilderRefetchCanvas";
import { ElementProps } from "../../../utils/types";
import FileUpload3D from "../../ModalComponents/FileUpload3D";
import Upload3DModelModal from "../../Modals/Upload3DModelModal";

import ThreeDMobileView from "./ThreeDMobileView";
import ThreeDView from "./ThreeDView";

const ThreeDElement = ({ qID, display }: ElementProps) => {
  const isOpen3DModel = useAppSelector(
    (state) => state.question.is3DModelModalOpen
  );
  const dispatch = useAppDispatch();
  const refetchCanvas = useSurveyCanvasRefetch();
  const isMobile = display === "mobile";
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [overrideUrl, setOverrideUrl] = useState<string | null>(null);
  const [isReadyToView, setIsReadyToView] = useState(false);

  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );
  const hasModel = !!question?.Model3D?.fileUrl;
  const url = question?.Model3D?.fileUrl;

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleUploadSuccess = (model: any) => {
    setOverrideUrl(model?.fileUrl);
    setIsReadyToView(true);
    refetchCanvas();
    dispatch(set3DModelModalOpen(false));
  };

  const handleUploadError = (msg: string) => {
    // optional toast/snackbar here
    console.error(msg);
  };

  const handleCloseModal = () => {
    refetchCanvas();
    dispatch(set3DModelModalOpen(false));
  };

  useEffect(() => {
    setIsReadyToView(hasModel);
  }, [hasModel, question?.questionID]);

  if (isReadyToView) {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          width: "100%",
          height: isMobile ? "680px" : "660px",
          zIndex: 20,
          border: "2px solid blue",
        }}
      >
        {display === "mobile" ? (
          <ThreeDMobileView url={overrideUrl ?? url!} />
        ) : (
          <ThreeDView url={overrideUrl ?? url!} />
        )}
      </div>
    );
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => dispatch(set3DModelModalOpen(true))}
          variant="contained"
          startIcon={<FileUploadIcon />}
          sx={{
            bgcolor: "common.white",
            color: "#2563EB",
            borderRadius: 2.5,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.92)",
              boxShadow: "none",
            },
            transition: "background-color .2s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Upload Your Model
        </Button>
      </div>
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
    </>
  );
};

export default ThreeDElement;
