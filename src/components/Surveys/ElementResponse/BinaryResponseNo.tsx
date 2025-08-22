import { useEffect, useState } from "react";

import { Box, ClickAwayListener, TextField } from "@mui/material";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../app/slices/elementApiSlice";
import { useKeyboardEditableRow } from "../../../hooks/useKeyboardEdit";
import { BinaryResponseProps } from "../../../utils/types";
import { mergeHandlers } from "../../../utils/utils";
import EnterToEditTooltip from "../../tooltip/EnterToEditTooltip";

const BinaryResponseNo = ({
  questionID,
  buttonTextNo,
  index,
  display,
}: BinaryResponseProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tipOpen, setTipOpen] = useState(false);

  const [updateQuestionPreferenceUIConfig] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const {
    isEditing,
    text: editText,
    setText: setEditText,
    editProps,
    editorProps,
    enterEdit,
    handleClickAway,
  } = useKeyboardEditableRow({
    initialText: buttonTextNo ?? "No",
    externalValue: buttonTextNo,
    rowDataRole: "binary-item",
    siblingsSelector: '[data-role="binary-item"]',
    onSave: async (next) => {
      if (next.trim() !== (buttonTextNo ?? "").trim()) {
        await updateQuestionPreferenceUIConfig({
          questionID,
          uiConfig: { buttonTextNo: next },
        }).unwrap?.();
      }
    },
  });

  useEffect(() => {
    if (buttonTextNo) {
      setEditText(buttonTextNo);
    }
  }, [buttonTextNo]);

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
          boxShadow: "8px 8px 24px #e0e0e0, -8px -8px 24px #ffffff", "&:focus": { outline: "2px solid #6366F1", outlineOffset: 2 },
          "&:hover": {
            backgroundColor: "#f5f7ff",
            boxShadow: "0 4px 12px rgba(80, 84, 255, 0.12)",
          },
        }}
        onMouseEnter={() => setHoveredIndex(index!)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <Box sx={{ flexGrow: 1 }}>
          {isEditing ? (
            <ClickAwayListener onClickAway={handleClickAway}>
              <TextField
                {...editorProps}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
                inputProps={{
                  maxLength: 60,
                }}
                sx={{
                  width: "100%",
                  outline: "none",
                }}
              />
            </ClickAwayListener>
          ) : (
            <Box
              onClick={() => enterEdit()}
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
    </EnterToEditTooltip>
  );
};

export default BinaryResponseNo;
