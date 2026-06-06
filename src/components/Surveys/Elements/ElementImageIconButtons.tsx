import { useState } from "react";

import { Box, IconButton, Tooltip } from "@mui/material";
import { ImageOff, ImagePlus } from "lucide-react";

import { useRemoveQuestionImageMutation } from "../../../app/slices/elementApiSlice";
import { QuestionImageUploadProps } from "../../../utils/types";
import QuestionImageUploadModal from "../../Modals/QuestionImageUploadModal";

const ElementImageIconButtons = ({
  questionID,
  questionImageID,
}: QuestionImageUploadProps) => {
  const [replaceImageModalOpen, setReplaceImageModalOpen] =
    useState<boolean>(false);
  const [removeQuestionImage] = useRemoveQuestionImageMutation();

  const handleRemoveImage = async () => {
    try {
      await removeQuestionImage({ questionID, questionImageID }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      className="control-buttons"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
        transition: "opacity 0.3s ease",
      }}
    >
      <Tooltip title="Replace Image">
        <IconButton
          onClick={() => setReplaceImageModalOpen(true)}
          sx={{
            width: 38,
            height: 38,
            borderRadius: "10px",
            backgroundColor: "rgba(15, 23, 42, 0.78)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.65)",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.28)",
            backdropFilter: "blur(8px)",
            "&:hover": {
              backgroundColor: "rgba(30, 41, 59, 0.92)",
              color: "#FFFFFF",
            },
          }}
        >
          <ImagePlus size={22} strokeWidth={2.4} />
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
            width: 38,
            height: 38,
            borderRadius: "10px",
            backgroundColor: "rgba(127, 29, 29, 0.82)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.7)",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(8px)",
            "&:hover": {
              backgroundColor: "rgba(153, 27, 27, 0.95)",
              color: "#FFFFFF",
            },
          }}
        >
          <ImageOff size={22} strokeWidth={2.4} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ElementImageIconButtons;
