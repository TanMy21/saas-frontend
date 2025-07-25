import { useEffect, useState } from "react";

import { Box, ClickAwayListener, TextField } from "@mui/material";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../app/slices/elementApiSlice";
import { BinaryResponseProps } from "../../../utils/types";

const BinaryResponseYes = ({
  questionID,
  buttonTextYes,
  index,
  display,
}: BinaryResponseProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState<string>(buttonTextYes!);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [updateQuestionPreferenceUIConfig] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleUpdateResponseText = async () => {
    if (editText.trim() !== buttonTextYes?.trim()) {
      try {
        const uiConfig = { buttonTextYes: editText };
        await updateQuestionPreferenceUIConfig({
          questionID,
          uiConfig,
        });
      } catch (error) {
        console.error(error);
      }
    }

    setIsEditing(false);
    // setEditingID(null);
  };

  const handleClickAway = () => {
    if (isEditing) {
      handleUpdateResponseText();
    }
  };

  useEffect(() => {
    if (buttonTextYes) {
      setEditText(buttonTextYes);
    }
  }, [buttonTextYes]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: display === "mobile" ? "84%" : "100%",
        height: 48,
        alignItems: "center",
        gap: 2,
        p: 1,
        pl: 4,
        backgroundColor: "#f8f9fc",
        border: "1px solid #E2E8F0",
        borderRadius: 6,
        mb: 1.5,
        transition: "box-shadow 0.2s ease-in-out",
        boxShadow: "8px 8px 24px #e0e0e0, -8px -8px 24px #ffffff",
        "&:hover": {
          backgroundColor: "#f5f7ff",
          boxShadow: "0 4px 12px rgba(80, 84, 255, 0.12)",
        },
      }}
      onMouseEnter={() => setHoveredIndex(index!)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <Box onDoubleClick={() => handleDoubleClick()} sx={{ flexGrow: 1 }}>
        {isEditing ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <TextField
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              inputProps={{
                maxLength: 60,
              }}
              sx={{
                width: "96%",
                outline: "none",
              }}
            />
          </ClickAwayListener>
        ) : (
          <Box
            onClick={() => setIsEditing(true)}
            sx={{
              py: 1,
              px: 1,
              cursor: "text",
              borderRadius: 1,
              color: "#626B77",
              width: "92%",
              fontSize: 16,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            {editText}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BinaryResponseYes;
