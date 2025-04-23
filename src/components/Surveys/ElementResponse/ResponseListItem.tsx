import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, TextField } from "@mui/material";
import { FaGripVertical } from "react-icons/fa6";

import {
  useDeleteOptionMutation,
  useUpdateOptionTextandValueMutation,
} from "../../../app/slices/optionApiSlice";
import { OptionType, ResponseListItemProps } from "../../../utils/types";

const ResponseListItem = ({ response, index }: ResponseListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingID, setEditingID] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  const [deleteOption] = useDeleteOptionMutation();

  const deleteResponseItem = async (optionID: string) => {
    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditText(event.target.value);
  };

  const handleDoubleClick = (option: OptionType) => {
    setIsEditing(true);
    setEditingID(option.optionID);
    setEditText(option.text);
  };

  const handleUpdateResponseText = async () => {
    if (!editingID) return;

    if (editText.trim() !== response.text.trim()) {
      try {
        await updateOptionTextandValue({
          optionID: editingID,
          text: editText,
          value: editText,
        });
      } catch (error) {
        console.error(error);
      }
    }

    setIsEditing(false);
    setEditingID(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: 48,
        alignItems: "center",
        gap: 2,
        p: 1,
        backgroundColor: "#E0E0E0",
        borderRadius: 4,
        mb: 1.5,
        transition: "all 0.2s",
        "&:hover": {
          backgroundColor: "grey.100",
        },
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <Box
        sx={{
          mt: 1,
          cursor: "grab",
          opacity: hoveredIndex === index ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        <FaGripVertical size={18} style={{ color: "#6D7584" }} />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 28,
          width: 28,
          backgroundColor: "primary.main",
          color: "white",
          borderRadius: "50%",
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: 500 }}>{index + 1}</span>
      </Box>

      <Box
        onDoubleClick={() => handleDoubleClick(response)}
        sx={{ flexGrow: 1 }}
      >
        {isEditing ? (
          <TextField
            value={editText}
            onChange={handleChange}
            onBlur={handleUpdateResponseText}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleUpdateResponseText();
              }

              if (e.key === "Escape") {
                setIsEditing(false);
                setEditingID(null);
                setEditText("");
              }
            }}
            autoFocus
            inputProps={{
              maxLength: 60,
            }}
            sx={{
              width: "100%",
              // padding: 1,
              // border: "1px solid #BFDBFE",
              // borderRadius: 8,
              outline: "none",
            }}
          />
        ) : (
          <Box
            onClick={() => setIsEditing(true)}
            sx={{
              py: 1.5,
              px: 1,
              cursor: "text",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            {response.text}
          </Box>
        )}
      </Box>

      <Button
        onClick={() => deleteResponseItem(response.optionID)}
        aria-label="Delete instruction"
        sx={{
          p: 1.5,
          minWidth: "auto",
          transition: "background-color 0.2s",
          backgroundColor: "transparent",
          color: "darkred",
          "&:hover": {
            backgroundColor: "transparent",
          },
          opacity: hoveredIndex === index ? 1 : 0,
        }}
      >
        <DeleteIcon />
      </Button>
    </Box>
  );
};

export default ResponseListItem;
