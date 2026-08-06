import { useState } from "react";

import { Box, IconButton, Tooltip } from "@mui/material";
import { ImageOff  } from "lucide-react";

import { useRemoveQuestionImageMutation } from "../../../app/slices/elementApiSlice";
import { useSurveyEditLock } from "../../../hooks/useSurveyEditLock";
import { QuestionImageUploadProps } from "../../../utils/types";
import QuestionImageUploadModal from "../../Modals/QuestionImageUploadModal";

const ElementImageIconButtons = ({
  questionID,
  questionImageID,
}: QuestionImageUploadProps) => {
  const { isEditLocked, guardStrictEdit } = useSurveyEditLock();

  const [replaceImageModalOpen, setReplaceImageModalOpen] =
    useState<boolean>(false);
  const [removeQuestionImage] = useRemoveQuestionImageMutation();

  const handleRemoveImage = async () => {
    if (!guardStrictEdit()) return;
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
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "transparent",
        transition: "opacity 0.3s ease",
      }}
    >
      {isEditLocked && (
        <QuestionImageUploadModal
          uploadImageModalOpen={replaceImageModalOpen}
          setUploadImageModalOpen={setReplaceImageModalOpen}
          questionID={questionID}
        />
      )}
      <Tooltip title="Remove Image">
        <IconButton
          onClick={handleRemoveImage}
          disabled={isEditLocked}
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
