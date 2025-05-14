import { useState } from "react";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ImageIcon from "@mui/icons-material/Image";
import { Box, IconButton, Tooltip } from "@mui/material";

import { useRemoveQuestionImageMutation } from "../../../app/slices/elementApiSlice";
import { QuestionImageUploadProps } from "../../../utils/types";
import QuestionImageUploadModal from "../../Modals/QuestionImageUploadModal";

const ElementImageIconButtons = ({ questionID }: QuestionImageUploadProps) => {
  const [replaceImageModalOpen, setReplaceImageModalOpen] =
    useState<boolean>(false);
  const [removeQuestionImage] = useRemoveQuestionImageMutation();

  const handleRemoveImage = async () => {
    try {
      await removeQuestionImage(questionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      className="control-buttons"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        gap: 2,
        transition: "opacity 0.3s ease",
      }}
    >
      <Tooltip title="Replace Image">
        <IconButton
          onClick={() => setReplaceImageModalOpen(true)}
          sx={{
            backgroundColor: "white",
            color: "#848484",
            width: "28px",
            height: "28px",
            borderRadius: "8%",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "white",
              color: "#848484",
            },
          }}
        >
          <ImageIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <QuestionImageUploadModal
        uploadImageModalOpen={replaceImageModalOpen}
        setUploadImageModalOpen={setReplaceImageModalOpen}
        questionID={questionID}
      />
      <Tooltip title="Remove Image">
        <IconButton
          onClick={handleRemoveImage}
          sx={{
            width: "28px",
            height: "28px",
            borderRadius: "8%",
            backgroundColor: "white",
            color: "#848484",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "white",
              color: "#848484",
            },
          }}
        >
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ElementImageIconButtons;
