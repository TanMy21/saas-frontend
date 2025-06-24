import { useState } from "react";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Box, Button } from "@mui/material";

import { QuestionImageUploadProps } from "../../../../utils/types";
import QuestionImageUploadModal from "../../../Modals/QuestionImageUploadModal";

const QuestionImageUpload = ({ questionID }: QuestionImageUploadProps) => {
  const [uploadImageModalOpen, setUploadImageModalOpen] =
    useState<boolean>(false);
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<FileUploadIcon />}
        onClick={() => setUploadImageModalOpen(true)}
        sx={{
          px: 4,
          py: 1.5,
          backgroundColor: "#DBEAFE",
          border: "2px dashed",
          borderColor: "#BFDBFE",
          borderRadius: "12px",
          color: "#2B68EC",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "blue.100",
            borderColor: "blue.300",
            "& .icon": {
              transform: "scale(1.1)",
            },
            "& .text": {
              transform: "translateY(-1px)",
            },
          },
        }}
      >
        Upload image
      </Button>
      <QuestionImageUploadModal
        uploadImageModalOpen={uploadImageModalOpen}
        setUploadImageModalOpen={setUploadImageModalOpen}
        questionID={questionID}
      />
    </Box>
  );
};

export default QuestionImageUpload;
