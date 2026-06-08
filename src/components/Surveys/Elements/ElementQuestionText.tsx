import { useRef } from "react";

import { Box } from "@mui/material";

import {
  useUpdateElementDescriptionMutation,
  useUpdateElementTextMutation,
} from "../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/typedReduxHooks";
import useAuth from "../../../hooks/useAuth";
import { useDebouncedElementDispatch } from "../../../hooks/useDebouncedElementDispatch";
import { useEditController } from "../../../hooks/useEditController";
import { useOutsideSave } from "../../../hooks/useOutsideSave";
import { useAppTheme } from "../../../theme/useAppTheme";
import { sanitizeRichTextHtml } from "../../../utils/richTextUtils";
import { ElementProps } from "../../../utils/types";
import { getDefaultQuestionTextAlign, isOrderable } from "../../../utils/utils";

import { EditableLine } from "./EditableLine";
import { EditableQuestionText } from "./EditableQuestionTextandDescription";
import { OrderBadge } from "./OrderBadge";

const ElementQuestionText = ({ display }: ElementProps) => {
  const { primary } = useAppTheme();
  const dispatch = useAppDispatch();
  const { can } = useAuth();
  const canEdit = can("UPDATE_QUESTION");
  const typographySettings = useAppSelector(
    (state: RootState) => state.elementTypography,
  );

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );
  const { questionID, order, text, description, type } = question || {};

  const show = isOrderable(type, order);
  const defaultTextAlign = getDefaultQuestionTextAlign(type);

  const titleFontSize =
    typographySettings.titleFontSize ??
    question?.questionPreferences?.titleFontSize ??
    36;
  const titleFontSizeMobile =
    typographySettings.titleFontSizeMobile ??
    question?.questionPreferences?.titleFontSizeMobile ??
    28;
  const titleTextColor =
    typographySettings.titleTextColor ??
    question?.questionPreferences?.titleTextColor ??
    "#000000";
  const descriptionFontSize =
    typographySettings.descriptionFontSize ??
    question?.questionPreferences?.descriptionFontSize ??
    16;
  const descriptionFontSizeMobile =
    typographySettings.descriptionFontSizeMobile ??
    question?.questionPreferences?.descriptionFontSizeMobile ??
    16;
  const descriptionTextColor =
    typographySettings.descriptionTextColor ??
    question?.questionPreferences?.descriptionTextColor ??
    "#000000";

  const defaultFontSize = 20;
  const orderFontSize = titleFontSize * 0.6;
  const actualFontSize =
    display === "mobile" ? defaultFontSize : orderFontSize || defaultFontSize;
  const circleSizeXL = actualFontSize * 1.6;
  const circleSizeMD = actualFontSize * 2;

  const textFontSize =
    display === "mobile" ? titleFontSizeMobile : titleFontSize;
  const descFontSize =
    display === "mobile" ? descriptionFontSizeMobile : descriptionFontSize;

  const [updateElementText] = useUpdateElementTextMutation();
  const [updateElementDescription] = useUpdateElementDescriptionMutation();

  const {
    editingTarget,
    beginEdit,
    endEdit,
    saveTitleIfChanged,
    saveDescriptionIfChanged,
  } = useEditController({
    questionID,
    text,
    description,
    updateElementText,
    updateElementDescription,
  });

  const { debouncedUpdate, clearTimers } = useDebouncedElementDispatch(
    dispatch,
    questionID,
  );

  const rootRef = useRef<HTMLDivElement | null>(null);

  /**
   * Sanitizes title rich text before updating local state or sending debounced API updates.
   * This prevents unsupported HTML from being stored.
   */
  const handleChangeTitle = (nextHTML: string) => {
    const safeHTML = sanitizeRichTextHtml(nextHTML);

    dispatch(updateQuestionField({ key: "text", value: safeHTML }));
    debouncedUpdate("text", safeHTML);
  };

  /**
   * Sanitizes description rich text before updating local state or sending debounced API updates.
   * This prevents unsupported HTML from being stored.
   */
  const handleChangeDesc = (nextHTML: string) => {
    const safeHTML = sanitizeRichTextHtml(nextHTML);

    dispatch(updateQuestionField({ key: "description", value: safeHTML }));
    debouncedUpdate("description", safeHTML);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!canEdit) {
      // Prevent browser navigation (backspace)
      if (e.key === "Backspace") {
        e.preventDefault();
      }

      // Prevent any typing/editing
      if (e.key.length === 1 || e.key === "Enter") {
        e.preventDefault();
      }
    }

    if (e.key === "Escape") {
      clearTimers();
      endEdit();
    } else if (e.key === "Enter") {
      clearTimers();
      if (editingTarget === "title") saveTitleIfChanged();
      if (editingTarget === "description") saveDescriptionIfChanged();
      endEdit();
      e.preventDefault();
    }
  };

  // Save changes if user clicks outside
  useOutsideSave(Boolean(editingTarget !== "none"), rootRef, () => {
    clearTimers();
    saveTitleIfChanged();
    saveDescriptionIfChanged();
    endEdit();
  });

  return (
    <>
      {display === "desktop" ? (
        <Box
          ref={rootRef}
          sx={{
            transformOrigin: "bottom",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            border: "2px solid green",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginX: "auto",
              width: "100%",
              border: "2px solid blue",
            }}
          >
            {/* Title row */}
            <Box
              onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
              }}
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                mx: "auto",
                width: "98%",
                // border: "2px solid black",
              }}
            >
              {show && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flex: `0 0 ${show ? "8%" : "8%"}`,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: show ? "8%" : "8%",
                    mt: 0.5,
                    minWidth: 0,
                    // border: "2px solid red",
                  }}
                >
                  <OrderBadge
                    show={isOrderable(type, order)}
                    sizeMD={circleSizeMD}
                    sizeXL={circleSizeXL}
                    color={primary.light}
                    fontSize={orderFontSize || 20}
                    value={order}
                  />
                </Box>
              )}
              <Box
                sx={{
                  ...(show
                    ? {
                        display: "flex",
                        width: "100%",
                        minWidth: 0,
                      }
                    : {
                        display: "flex",
                        flex: "0 0 98%",
                        width: "98%",
                      }),
                  flexDirection: "row",
                  maxWidth: show
                    ? "unset"
                    : { xs: "100%", md: "min(72ch, 100%)" },
                  minWidth: 0,
                  justifyContent: "center",
                  // border: "2px solid purple",
                }}
              >
                <Box
                  sx={{
                    ...(show
                      ? {
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          minWidth: 0,
                        }
                      : {
                          display: "block",
                          width: "100%",
                          maxWidth: { xs: "100%", md: "min(72ch, 100%)" },
                        }),
                    textAlign: "left",
                    whiteSpace: "normal",
                    border: "2px solid yellow",
                  }}
                >
                  <EditableQuestionText
                    active={canEdit && editingTarget === "title"}
                    value={text}
                    onStartEdit={() => {
                      if (!canEdit) return;
                      beginEdit("title");
                    }}
                    onChange={handleChangeTitle}
                    onFormatted={saveTitleIfChanged}
                    onKeyDown={handleKeyDown}
                    editorSx={{
                      ...(show
                        ? {
                            display: "block",
                            width: "100%",
                            maxWidth: "100%",
                            minWidth: 0,
                          }
                        : {
                            display: "block",
                            width: "100%",
                          }),
                      textAlign: defaultTextAlign,
                      backgroundColor: "transparent",
                      fontFamily:
                        'Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',
                      fontWeight: 700,
                      fontStyle: "normal",
                      fontSize: textFontSize,
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                      color: titleTextColor,
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Description row */}
            <Box
              onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                if (editingTarget !== "none") e.preventDefault();
              }}
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "60%",
                minWidth: 0,
                margin: "1% auto",
                // border: "2px solid blue",
              }}
            >
              <EditableQuestionText
                active={canEdit && editingTarget === "description"}
                value={description}
                placeholder="Description (optional)"
                onStartEdit={() => {
                  if (!canEdit) return;
                  beginEdit("description");
                }}
                onChange={handleChangeDesc}
                onFormatted={saveDescriptionIfChanged}
                onKeyDown={handleKeyDown}
                editorSx={{
                  backgroundColor: "transparent",
                  fontStyle: "italic",
                  fontFamily:
                    "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  whiteSpace: "normal",
                  width: "100%",
                  maxWidth: "100%",
                  minWidth: 0,
                  textAlign: defaultTextAlign,
                  fontSize: descFontSize,
                  color: descriptionTextColor,
                  lineHeight: 1.5,
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  "& *": {
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    lineHeight: "inherit",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          ref={rootRef}
          sx={{
            transformOrigin: "bottom",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            // border: "2px solid green",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginX: "auto",
              width: "100%",
              // border: "2px solid blue",
            }}
          >
            {/* Title row */}
            <Box
              onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                if (editingTarget !== "none") e.preventDefault();
              }}
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mx: "auto",
                width: "98%",
                gap: "8%",
                // border: "2px solid black",
              }}
            >
              {show && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flex: `0 0 ${show ? "24%" : "28%"}`,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: show ? "24%" : "28%",
                    minWidth: 0,
                    // border: "2px solid red",
                  }}
                >
                  <OrderBadge
                    show={isOrderable(type, order)}
                    sizeMD={circleSizeMD}
                    sizeXL={circleSizeXL}
                    color={primary.light}
                    fontSize={orderFontSize || 20}
                    value={order}
                  />
                </Box>
              )}
              <Box
                sx={{
                  ...(show
                    ? {
                        display: "flex",
                        width: "max-content",
                      }
                    : {
                        display: "flex",
                        flex: "0 0 98%",
                        width: "98%",
                      }),
                  flexDirection: "row",
                  maxWidth: "98%",
                  minWidth: 0,
                  justifyContent: "center",
                  // border: "2px solid purple",
                }}
              >
                <Box
                  sx={{
                    ...(show
                      ? {
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }
                      : {
                          display: "block",
                          width: "fit-content",
                          maxWidth: { xs: "100%", md: "min(72ch, 100%)" },
                        }),
                    textAlign: "left",
                    whiteSpace: "normal",
                    // border: "2px solid yellow",
                  }}
                >
                  <EditableLine
                    active={canEdit && editingTarget === "title"}
                    value={text}
                    onStartEdit={() => {
                      if (!canEdit) return;
                      beginEdit("title");
                    }}
                    onChange={handleChangeTitle}
                    onFormatted={saveTitleIfChanged}
                    onKeyDown={handleKeyDown}
                    textFieldId="title-input"
                    cursorWhenActive="text"
                    textFieldSx={{
                      ...(show
                        ? {
                            display: "inline-block",
                            width: "max-content",
                            maxWidth: "none",
                          }
                        : {
                            display: "block",
                            width: "100%",
                          }),
                      textAlign: "left",
                      backgroundColor: "transparent",
                      fontFamily:
                        'Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',
                      fontWeight: 700,
                      fontStyle: "normal",
                      fontSize: textFontSize,
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                      "& *": {
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        lineHeight: "inherit",
                      },
                      border: "2px solid green",
                    }}
                    typographySx={{
                      ...(show
                        ? {
                            display: "inline-block",
                            width: "max-content",
                            maxWidth: "none",
                          }
                        : {
                            display: "block",
                            width: "100%",
                            maxWidth: { xs: "100%", md: "min(72ch, 100%)" },
                          }),
                      textAlign: "left",
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                      fontFamily:
                        'Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',
                      fontWeight: 700,
                      fontSize: textFontSize,
                      color: titleTextColor,
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ElementQuestionText;
