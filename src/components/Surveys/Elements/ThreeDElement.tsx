import { useEffect, useState } from "react";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../../../app/store";
import { ElementProps } from "../../../utils/types";
import FileUpload3D from "../../ModalComponents/FileUpload3D";
import Upload3DModelModal from "../../Modals/Upload3DModelModal";

import ThreeDView from "./ThreeDView";

const ThreeDElement = ({ qID, display }: ElementProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isReadyToView, setIsReadyToView] = useState(false);

  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );
  const hasModel = !!question?.Model3D?.fileUrl;
  const url = question?.Model3D?.fileUrl;

  console.log("ThreeDElement question:", question);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleUploadSuccess = (_model: any) => {
    setIsReadyToView(true);
    setIsModalOpen(false);
  };

  const handleUploadError = (msg: string) => {
    // optional toast/snackbar here
    console.error(msg);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          minHeight: "600px",
          zIndex: 20,
          border: "2px solid blue",
        }}
      >
        <ThreeDView url={url!} />
      </div>
    );
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => setIsModalOpen(true)}
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
        isOpen={isModalOpen}
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
