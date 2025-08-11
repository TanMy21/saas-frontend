import { useState } from "react";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Box, Button } from "@mui/material";

import FileUpload3D from "../../ModalComponents/FileUpload3D";
import Upload3DModelModal from "../../Modals/Upload3DModelModal";

const ThreeDElement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Box textAlign="center">
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
      </Box>
      <Upload3DModelModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Upload 3D Model"
      >
        <FileUpload3D onFileSelect={handleFileSelect} />
      </Upload3DModelModal>
    </>
  );
};

export default ThreeDElement;
