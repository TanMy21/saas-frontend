import { useEffect, useState } from "react";

import { Box, IconButton, TextField, Typography } from "@mui/material";
import { CircleX } from "lucide-react";

import { useUpdateOptionTextandValueMutation } from "../../../app/slices/optionApiSlice";
import { OptionType } from "../../../utils/types";

export const TimedChoiceOptionCard = ({
  option,
  index,
  canEdit,
  canDelete,
  onDelete,
}: {
  option: OptionType;
  index: number;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (optionID: string) => void;
}) => {
  const [editText, setEditText] = useState(option.text);
  const [isEditing, setIsEditing] = useState(false);

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  /**
   * Keeps local edit text synced when RTK Query returns updated option data.
   */
  useEffect(() => {
    setEditText(option.text);
  }, [option.text]);

  /**
   * Saves the option text and value together so dropdown/radio-style response logic stays consistent.
   */
  const handleSave = async () => {
    if (!canEdit) return;

    const trimmedText = editText.trim();

    if (!trimmedText) {
      setEditText(option.text);
      setIsEditing(false);
      return;
    }

    if (trimmedText !== option.text.trim()) {
      await updateOptionTextandValue({
        optionID: option.optionID,
        text: trimmedText,
        value: trimmedText,
      }).unwrap?.();
    }

    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        flex: 1,
        minWidth: 0,
        border: "1px solid #E2E8F0",
        borderRadius: 3,
        bgcolor: "#FFFFFF",
        px: 2,
        py: 2,
        boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: "#FDBA74",
          boxShadow: "0 10px 28px rgba(234,88,12,0.12)",
        },
      }}
    >
      <Typography
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          bgcolor: "#FFF7ED",
          color: "#EA580C",
          fontSize: 13,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1.25,
        }}
      >
        {index === 0 ? "A" : "B"}
      </Typography>

      {isEditing ? (
        <TextField
          value={editText}
          autoFocus
          fullWidth
          size="small"
          onChange={(event) => setEditText(event.target.value)}
          onBlur={handleSave}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSave();
            }

            if (event.key === "Escape") {
              setEditText(option.text);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <Typography
          onClick={() => {
            if (!canEdit) return;
            setIsEditing(true);
          }}
          sx={{
            fontSize: 16,
            fontWeight: 700,
            color: "#0F172A",
            minHeight: 38,
            cursor: canEdit ? "text" : "default",
            wordBreak: "break-word",
          }}
        >
          {option.text}
        </Typography>
      )}

      {canDelete && (
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            onDelete(option.optionID);
          }}
          aria-label="Delete timed choice option"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "darkred",
            bgcolor: "transparent",
            "&:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          <CircleX fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
