import { useEffect, useState } from "react";

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
import { useKeyboardEditableRow } from "../../../hooks/useKeyboardEdit";
import { ResponseListItemProps } from "../../../utils/types";
import { mergeHandlers } from "../../../utils/utils";
import EnterToEditTooltip from "../../tooltip/EnterToEditTooltip";

const ResponseListItem = ({
  qType,
  response,
  index,
  display,
}: ResponseListItemProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tipOpen, setTipOpen] = useState(false);

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  const [deleteOption] = useDeleteOptionMutation();

  const {
    isEditing,
    text: editText,
    setText: setEditText,
    editProps,
    editorProps,
    enterEdit,
    handleClickAway,
  } = useKeyboardEditableRow({
    initialText: response.text,
    externalValue: response.text,
    rowDataRole: "response-item",
    siblingsSelector: '[data-role="response-item"]',
    onSave: async (nextText) => {
      if (nextText.trim() !== response.text.trim()) {
        await updateOptionTextandValue({
          optionID: response.optionID,
          text: nextText,
          value: nextText,
        }).unwrap?.();
      }
    },
  });

  const deleteResponseItem = async (optionID: string) => {
    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!tipOpen) return;
    const id = setTimeout(() => setTipOpen(false), 1800);
    return () => clearTimeout(id);
  }, [tipOpen]);

  return (
    <EnterToEditTooltip
      open={tipOpen && !isEditing}
      onOpenChange={setTipOpen}
      autoHideMs={1800}
    >
      <Box
        {...editProps}
        tabIndex={0}
        onFocus={mergeHandlers<React.FocusEvent<HTMLDivElement>>(
          (editProps as any).onFocus,
          () => setTipOpen(true)
        )}
        onBlur={mergeHandlers<React.FocusEvent<HTMLDivElement>>(
          (editProps as any).onBlur,
          () => setTipOpen(false)
        )}
        onKeyDownCapture={mergeHandlers<React.KeyboardEvent<HTMLDivElement>>(
          (editProps as any).onKeyDownCapture,
          (e) => {
            if (e.key === "Enter") setTipOpen(false);
          }
        )}
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
          position: "relative",
          "&:focus": { outline: "2px solid #6366F1", outlineOffset: 2 },
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
              tabIndex={-1}
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
              tabIndex={-1}
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
            tabIndex={-1}
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
          sx={{
            ...(display === "mobile" && { width: "92%" }),
            minWidth: 0,
            maxWidth: display === "mobile" ? "92%" : "100%",
            flex: 1,
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            // border: "2px solid red",
          }}
        >
          {isEditing ? (
            <ClickAwayListener onClickAway={handleClickAway}>
              <TextField
                {...editorProps}
                value={editText}
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
            <>
              <Box
                onClick={() => {
                  setTipOpen(false);
                  enterEdit();
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
              <span
                className="edit-hint"
                style={{
                  display: "none",
                  marginLeft: 8,
                  fontSize: 12,
                  color: "#888",
                }}
              >
                Press Enter to edit
              </span>
            </>
          )}
        </Box>
        <Button
          onClick={() => deleteResponseItem(response.optionID)}
          tabIndex={-1}
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
    </EnterToEditTooltip>
  );
};

export default ResponseListItem;
