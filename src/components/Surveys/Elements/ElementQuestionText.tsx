import { useRef } from "react";

import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import {
  useUpdateElementDescriptionMutation,
  useUpdateElementTextMutation,
} from "../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { useDebouncedElementDispatch } from "../../../hooks/useDebouncedElementDispatch";
import { useEditController } from "../../../hooks/useEditController";
import { useOutsideSave } from "../../../hooks/useOutsideSave";
import { useAppTheme } from "../../../theme/useAppTheme";
import { ElementProps } from "../../../utils/types";
import { isOrderable } from "../../../utils/utils";

import { EditableLine } from "./EditableLine";
import { OrderBadge } from "./OrderBadge";

const ElementQuestionText = ({ display }: ElementProps) => {
  const { primary } = useAppTheme();
  const dispatch = useDispatch();

  const typographySettings = useSelector(
    (state: RootState) => state.elementTypography
  );

  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );
  const { questionID, order, text, description, type } = question || {};

  const show = isOrderable(type, order);

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
    questionID
  );

  const rootRef = useRef<HTMLDivElement | null>(null);

  /* HTML from contentEditable and store as-is (rich) */
  const handleChangeTitle = (nextHTML: string) => {
    dispatch(updateQuestionField({ key: "text", value: nextHTML }));
    debouncedUpdate("text", nextHTML);
  };

  /* HTML from contentEditable and store as-is (rich) */
  const handleChangeDesc = (nextHTML: string) => {
    dispatch(updateQuestionField({ key: "description", value: nextHTML }));
    debouncedUpdate("description", nextHTML);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
                if (editingTarget !== "none") e.preventDefault();
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
                    mt:0.5,
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
                    active={editingTarget === "title"}
                    value={text}
                    onStartEdit={() => beginEdit("title")}
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
                      // border: "2px solid green",
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
                margin: "1% auto",
                // border: "2px solid blue",
              }}
            >
              <EditableLine
                active={editingTarget === "description"}
                value={description}
                placeholder="Description (optional)"
                onStartEdit={() => beginEdit("description")}
                onChange={handleChangeDesc}
                onFormatted={() => {
                  saveDescriptionIfChanged();
                }}
                onKeyDown={handleKeyDown}
                textFieldId="description-input"
                cursorWhenActive="text"
                textFieldSx={{
                  backgroundColor: "transparent",
                  fontFamily:
                    "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  fontSize: descFontSize,
                  lineHeight: 1.5,
                  "& *": {
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    lineHeight: "inherit",
                  },
                }}
                typographySx={{
                  fontStyle: "italic",
                  fontFamily:
                    "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  whiteSpace: "normal",
                  width: "fit-content",
                  fontSize: descFontSize,
                  color: descriptionTextColor,
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
                gap:"8%",
                // border: "2px solid black",
              }}
            >
              {show && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flex: `0 0 ${show ? "16%" : "24%"}`,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: show ? "16%" : "24%",
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
                    active={editingTarget === "title"}
                    value={text}
                    onStartEdit={() => beginEdit("title")}
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
