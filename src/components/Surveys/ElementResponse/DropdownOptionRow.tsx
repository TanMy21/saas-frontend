import { useEffect, useState } from "react";

import {
  Box,
  Button,
  ClickAwayListener,
  TextField,
  Typography,
} from "@mui/material";
import { CircleX } from "lucide-react";

import { useUpdateOptionTextandValueMutation } from "../../../app/slices/optionApiSlice";
import { useKeyboardEditableRow } from "../../../hooks/useKeyboardEdit";
import { OptionType } from "../../../utils/types";
import { mergeHandlers } from "../../../utils/utils";
import EnterToEditTooltip from "../../tooltip/EnterToEditTooltip";

export const DropdownOptionRow = ({
  option,
  index,
  canReorder,
  canEdit,
  canDelete,
  onDelete,
}: {
  option: OptionType;
  index: number;
  canReorder: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (optionID: string) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  const {
    isEditing,
    text: editText,
    setText: setEditText,
    editProps,
    editorProps,
    enterEdit,
    handleClickAway,
  } = useKeyboardEditableRow({
    initialText: option.text,
    externalValue: option.text,
    rowDataRole: "dropdown-option-item",
    siblingsSelector: '[data-role="dropdown-option-item"]',

    /**
     * Saves dropdown option text and value together.
     * Keeping value equal to text matches the existing option behavior.
     */
    onSave: async (nextText) => {
      if (!canEdit) return;

      const trimmedText = nextText.trim();

      if (!trimmedText) return;

      if (trimmedText !== option.text.trim()) {
        await updateOptionTextandValue({
          optionID: option.optionID,
          text: trimmedText,
          value: trimmedText,
        }).unwrap?.();
      }
    },
  });

  /**
   * Auto-hides the enter-to-edit helper tooltip.
   */
  useEffect(() => {
    if (!tipOpen) return;

    const id = setTimeout(() => setTipOpen(false), 1800);

    return () => clearTimeout(id);
  }, [tipOpen]);

  return (
    <EnterToEditTooltip
      open={canEdit && tipOpen && !isEditing}
      onOpenChange={setTipOpen}
      autoHideMs={1800}
    >
      <Box
        {...(canEdit ? editProps : {})}
        tabIndex={canEdit ? 0 : -1}
        onFocus={mergeHandlers<React.FocusEvent<HTMLDivElement>>(
          (editProps as any).onFocus,
          () => setTipOpen(true),
        )}
        onBlur={mergeHandlers<React.FocusEvent<HTMLDivElement>>(
          (editProps as any).onBlur,
          () => setTipOpen(false),
        )}
        onKeyDownCapture={mergeHandlers<React.KeyboardEvent<HTMLDivElement>>(
          (editProps as any).onKeyDownCapture,
          (event) => {
            if (
              !canEdit &&
              (event.key === "Backspace" || event.key === "Enter")
            ) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }

            if (event.key === "Enter") setTipOpen(false);
          },
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          width: "96%",
          px: 1.5,
          py: 1,
          border: "1px solid #E2E8F0",
          borderRadius: 1.5,
          bgcolor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          cursor: canReorder ? "grab" : canEdit ? "text" : "default",
          transition: "background-color 0.2s ease, box-shadow 0.2s ease",
          "&:focus": {
            outline: "2px solid #6366F1",
            outlineOffset: 2,
          },
          "&:hover": {
            bgcolor: "#F8FAFC",
            boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
          },
        }}
      >
        <Typography
          sx={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            bgcolor: "#F1F5F9",
            color: "#475569",
            fontSize: 12,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </Typography>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {isEditing ? (
            <ClickAwayListener onClickAway={handleClickAway}>
              <TextField
                {...editorProps}
                value={editText}
                disabled={!canEdit}
                onChange={(event) => setEditText(event.target.value)}
                autoFocus
                inputProps={{
                  maxLength: 200,
                }}
                sx={{
                  width: "100%",
                  outline: "none",
                  cursor: canEdit ? "text" : "not-allowed",
                }}
              />
            </ClickAwayListener>
          ) : (
            <Box
              onClick={() => {
                if (!canEdit) return;

                setTipOpen(false);
                enterEdit();
              }}
              sx={{
                py: 0.75,
                px: 0.75,
                borderRadius: 1,
                color: "#0F172A",
                fontSize: 14,
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: canEdit ? "text" : "default",
                "&:hover": {
                  bgcolor: canEdit ? "#FFFFFF" : "transparent",
                },
              }}
            >
              {option.text}
            </Box>
          )}
        </Box>

        {canDelete && (
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onDelete(option.optionID);
            }}
            tabIndex={-1}
            aria-label="Delete dropdown option"
            sx={{
              p: 0.75,
              minWidth: "auto",
              flexShrink: 0,
              color: "darkred",
              borderRadius: "50%",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s ease",
              "&:hover": {
                bgcolor: "transparent",
              },
            }}
          >
            <CircleX fontSize="small" />
          </Button>
        )}
      </Box>
    </EnterToEditTooltip>
  );
};
