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
import useAuth from "../../../hooks/useAuth";
import { useKeyboardEditableRow } from "../../../hooks/useKeyboardEdit";
import { ResponseListItemProps } from "../../../utils/types";
import { mergeHandlers } from "../../../utils/utils";
import EnterToEditTooltip from "../../tooltip/EnterToEditTooltip";

const OPTION_BRAND = "#0074EB";

const OPTION_BG = "#FFFFFF";
const OPTION_BORDER = "rgba(226, 232, 240, 0.9)";
const OPTION_HOVER_BORDER = "#CBD5E1";

const OPTION_TEXT = "#334155";
const OPTION_MUTED_TEXT = "#64748B";
const OPTION_MUTED_ICON = "#CBD5E1";

const OPTION_INDICATOR_BG = "#F8FAFC";
const OPTION_INDICATOR_BORDER = "#E2E8F0";
const OPTION_NUMBER_BG = "#F1F5F9";
const OPTION_NUMBER_TEXT = "#64748B";

const OPTION_HOVER_BG =
  "linear-gradient(90deg, rgba(0, 116, 235, 0.035), rgba(255, 255, 255, 1))";

const OPTION_FOCUS_BG =
  "linear-gradient(90deg, rgba(0, 116, 235, 0.05), rgba(255, 255, 255, 1))";

const OPTION_RESTING_SHADOW =
  "0 2px 8px rgba(15, 23, 42, 0.045), 0 1px 2px rgba(15, 23, 42, 0.04)";

const OPTION_HOVER_SHADOW =
  "0 10px 24px rgba(15, 23, 42, 0.08), 0 3px 8px rgba(15, 23, 42, 0.05)";

const OPTION_FOCUS_SHADOW =
  "0 10px 24px rgba(0, 116, 235, 0.12), 0 3px 8px rgba(15, 23, 42, 0.05)";

const ResponseListItem = ({
  qType,
  response,
  index,
  display,
}: ResponseListItemProps) => {
  const { can } = useAuth();
  const canReorder = can("REORDER_OPTION");
  const canEdit = can("UPDATE_OPTION");
  const canDelete = can("DELETE_OPTION");

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
      if (!canEdit) return;

      if (nextText.trim() !== response.text.trim()) {
        await updateOptionTextandValue({
          optionID: response.optionID,
          text: nextText,
          value: nextText,
        }).unwrap?.();
      }
    },
  });

  const isRadioOption = qType === "RADIO";
  const isCheckboxOption = qType === "MULTIPLE_CHOICE";
  const isNumberedOption = qType === "RANK" || qType === "INSTRUCTIONS";

  /**
   * Deletes a response option from the question.
   * Logs failures without interrupting the editor UI.
   */
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
          (e) => {
            if (!canEdit && (e.key === "Backspace" || e.key === "Enter")) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }

            if (e.key === "Enter") {
              setTipOpen(false);
            }
          },
        )}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: display === "mobile" ? "92%" : "100%",
          margin: display === "mobile" ? "2% auto" : "0 auto",
          alignItems: "center",
          gap: 1.25,
          p: 1.35,
          mb: 1.25,
          borderRadius: "14px",
          position: "relative",
          overflow: "hidden",

          // Clean white card surface with subtle visible depth.
          background: OPTION_BG,
          border: `1px solid ${OPTION_BORDER}`,
          boxShadow: OPTION_RESTING_SHADOW,

          cursor: canReorder ? "grab" : canEdit ? "text" : "not-allowed",
          transition:
            "background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",

          // Accessible brand focus ring.
          "&:focus": {
            outline: "2px solid rgba(0, 116, 235, 0.28)",
            outlineOffset: 2,
          },

          // Slightly lifted card hover state.
          "&:hover": {
            background: OPTION_HOVER_BG,
            borderColor: OPTION_HOVER_BORDER,
            boxShadow: OPTION_HOVER_SHADOW,
            transform: "translateY(-1px)",
          },

          "&:hover::before": {
            opacity: 1,
          },

          // Keeps the row visually active while editing.
          "&:focus-within": {
            background: OPTION_FOCUS_BG,
            borderColor: "rgba(0, 116, 235, 0.35)",
            boxShadow: OPTION_FOCUS_SHADOW,
          },

          "&:focus-within::before": {
            opacity: 1,
          },
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {display === "desktop" && canReorder && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: OPTION_MUTED_ICON,
              cursor: "grab",
              flexShrink: 0,
              opacity: hoveredIndex === index ? 1 : 0,
              transform:
                hoveredIndex === index ? "translateX(0)" : "translateX(4px)",
              transition:
                "opacity 0.18s ease, transform 0.18s ease, color 0.18s ease",

              // Slightly darkens the grip on direct hover.
              "&:hover": {
                color: OPTION_MUTED_TEXT,
              },
            }}
          >
            <FaGripVertical size={16} />
          </Box>
        )}

        {isRadioOption && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...(display === "mobile" && { marginLeft: 1 }),
              height: 30,
              width: 30,
              borderRadius: "50%",
              backgroundColor: OPTION_INDICATOR_BG,
              border: `1px solid ${OPTION_INDICATOR_BORDER}`,
              flexShrink: 0,
            }}
          >
            <Radio
              checked={false}
              tabIndex={-1}
              sx={{
                transform: "scale(1)",
                padding: 0,
                color: OPTION_MUTED_ICON,

                // Uses brand blue if this option becomes checked later.
                "&.Mui-checked": {
                  color: OPTION_BRAND,
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

        {isCheckboxOption && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...(display === "mobile" && { marginLeft: 1 }),
              height: 30,
              width: 30,
              borderRadius: "9px",
              backgroundColor: OPTION_INDICATOR_BG,
              border: `1px solid ${OPTION_INDICATOR_BORDER}`,
              flexShrink: 0,
            }}
          >
            <Checkbox
              checked={false}
              tabIndex={-1}
              sx={{
                transform: "scale(1)",
                padding: 0,
                color: OPTION_MUTED_ICON,

                // Uses brand blue if this option becomes checked later.
                "&.Mui-checked": {
                  color: OPTION_BRAND,
                },

                "& .MuiSvgIcon-root": {
                  borderRadius: 1,
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

        {(isNumberedOption || (!isRadioOption && !isCheckboxOption)) && (
          <Box
            tabIndex={-1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...(display === "mobile" && { marginLeft: 1 }),
              height: 30,
              width: 30,
              borderRadius: "9px",
              flexShrink: 0,

              // Number pill used for rank/instructions and fallback option types.
              backgroundColor: OPTION_NUMBER_BG,
              border: `1px solid ${OPTION_INDICATOR_BORDER}`,
              color: OPTION_NUMBER_TEXT,

              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {index + 1}
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
          }}
        >
          {isEditing ? (
            <ClickAwayListener onClickAway={handleClickAway}>
              <TextField
                {...editorProps}
                value={editText}
                disabled={!canEdit}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
                inputProps={{
                  maxLength: 200,
                }}
                sx={{
                  width: display === "mobile" ? "100%" : "96%",
                  outline: "none",
                  cursor: canEdit ? "text" : "not-allowed",

                  // Keeps the edit field visually aligned with the option row.
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#FFFFFF",

                    "& fieldset": {
                      borderColor: OPTION_BORDER,
                    },

                    "&:hover fieldset": {
                      borderColor: OPTION_HOVER_BORDER,
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: OPTION_BRAND,
                      borderWidth: 2,
                    },
                  },

                  "& .MuiInputBase-input": {
                    color: OPTION_TEXT,
                    fontWeight: 600,
                    fontSize: display === "mobile" ? 14 : 16,
                  },
                }}
              />
            </ClickAwayListener>
          ) : (
            <>
              <Box
                onClick={() => {
                  if (!canEdit) return;

                  setTipOpen(false);
                  enterEdit();
                }}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: "100%",
                  py: 0.75,
                  px: 0.5,
                  cursor: canEdit ? "text" : "not-allowed",
                  borderRadius: 1.5,

                  // Simple modern option text.
                  color: OPTION_TEXT,

                  fontSize: display === "mobile" ? 14 : 16,
                  fontWeight: 600,
                  lineHeight: 1.45,

                  // Keeps hover on the row, not an inner text block.
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
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
                  color: OPTION_MUTED_TEXT,
                }}
              >
                Press Enter to edit
              </span>
            </>
          )}
        </Box>

        {canDelete && (
          <Button
            onClick={() => {
              if (!canDelete) return;

              deleteResponseItem(response.optionID);
            }}
            tabIndex={-1}
            aria-label="Delete option"
            sx={{
              p: 1.15,
              flexShrink: 0,
              minWidth: "auto",
              backgroundColor: "transparent",
              color: "#B91C1C",
              borderRadius: "50%",
              opacity: hoveredIndex === index ? 1 : 0,
              transform: hoveredIndex === index ? "scale(1)" : "scale(0.96)",
              transition:
                "opacity 0.18s ease, transform 0.18s ease, background-color 0.18s ease, color 0.18s ease",

              // Keeps delete subtle but clear when hovered.
              "&:hover": {
                backgroundColor: "rgba(185, 28, 28, 0.08)",
                color: "#991B1B",
              },
            }}
          >
            <DeleteIcon />
          </Button>
        )}
      </Box>
    </EnterToEditTooltip>
  );
};
export default ResponseListItem;
