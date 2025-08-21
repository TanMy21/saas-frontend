import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  Radio,
  TextField,
} from "@mui/material";
import { FaGripVertical } from "react-icons/fa6";

import {
  useDeleteOptionMutation,
  useUpdateOptionTextandValueMutation,
} from "../../../app/slices/optionApiSlice";
import { OptionType, ResponseListItemProps } from "../../../utils/types";

const ResponseListItem = ({
  qType,
  response,
  index,
  display,
}: ResponseListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingID, setEditingID] = useState<string | null>(response.optionID);
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

  const handleDoubleClick = (option: OptionType) => {
    setIsEditing(true);
    setEditingID(option.optionID);
    setEditText(option.text);
  };

  const handleUpdateResponseText = async () => {
    if (!editingID) {
      setIsEditing(false);
      return;
    }
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

  const handleClickAway = () => {
    if (isEditing) {
      handleUpdateResponseText();
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleUpdateResponseText();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(false);
      setEditingID(null);
      setEditText(response.text);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: display === "mobile" ? "92%" : "100%",
        margin: display === "mobile" ? "2% auto" : "0 auto",
        // height: 48,
        alignItems: "center",
        gap: 2,
        p: 1,
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
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {display === "desktop" && (
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
      )}
      {qType === "RADIO" && (
        <Box>
          <Radio
            checked={false}
            sx={{
              transform: "scale(1.2)",
              padding: 0,
              ...(display === "mobile" && { marginLeft: 1 }),
              color: "#CFD3D9",
              "&:hover": {
                backgroundColor: "transparent",
              },
              "&.Mui-focusVisible": {
                outline: "none",
              },
            }}
          />
        </Box>
      )}
      {qType === "MULTIPLE_CHOICE" && (
        <Box>
          <Checkbox
            checked={false}
            sx={{
              transform: "scale(1.2)",
              padding: 0,
              ...(display === "mobile" && { marginLeft: 1 }),
              color: "#CFD3D9",
              borderRadius: 4,
              "& .MuiSvgIcon-root": {
                borderRadius: 4,
              },
              "&:hover": {
                backgroundColor: "transparent",
              },
              "&.Mui-focusVisible": {
                outline: "none",
              },
            }}
          />
        </Box>
      )}
      {(qType === "INSTRUCTIONS" || qType === "RANK") && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...(display === "mobile" && { marginLeft: 1 }),
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
      )}
      <Box
        onDoubleClick={() => handleDoubleClick(response)}
        sx={{
          // flexGrow: display === "mobile" ? 0 : 1,
          ...(display === "mobile" && { width: "92%" }),
          minWidth: 0, // allow shrinking
          maxWidth: display === "mobile" ? "92%" : "100%",
          // flexGrow: 1,
          flex: 1,
          // minWidth: display === "mobile" ? "60%" : "0",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          // border: "2px solid red",
        }}
      >
        {isEditing ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <TextField
              value={editText}
              onKeyDown={handleEditorKeyDown}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              inputProps={{
                maxLength: 200,
              }}
              sx={{
                width: display === "mobile" ? "100%" : "96%",
                outline: "none",
                // border: "2px solid green",
              }}
            />
          </ClickAwayListener>
        ) : (
          <Box
            onClick={() => {
              setIsEditing(true);
              setEditingID(response.optionID);
              setEditText(response.text);
            }}
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "100%",
              py: 1,
              px: 1,
              cursor: "text",
              borderRadius: 1,
              color: "#626B77",
              fontSize: display === "mobile" ? 14 : 16,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "white",
              },
              // border: "2px solid blue",
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
          flexShrink: 0,
          minWidth: "auto",
          transition: "background-color 0.2s",
          backgroundColor: "transparent",
          color: "darkred",
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "transparent",
          },
          opacity: hoveredIndex === index ? 1 : 0,
          // border: "2px solid orange",
        }}
      >
        <DeleteIcon />
      </Button>
    </Box>
  );
};

export default ResponseListItem;
