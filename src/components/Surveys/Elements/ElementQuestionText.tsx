import { useCallback, useEffect, useRef, useState } from "react";

import { Box, TextField, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import {
  useUpdateElementDescriptionMutation,
  useUpdateElementTextMutation,
} from "../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../app/slices/elementSlice";
import { updateElementField } from "../../../app/slices/surveySlice";
import { RootState } from "../../../app/store";
import { useAppTheme } from "../../../theme/useAppTheme";
import { ElementProps } from "../../../utils/types";

const ElementQuestionText = ({ display }: ElementProps) => {
  const DEBOUNCE_MS = 220;
  const { primary } = useAppTheme();
  const dispatch = useDispatch();
  const typographySettings = useSelector(
    (state: RootState) => state.elementTypography
  );

  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );
  const { questionID, order, text, description, type } = question || {};

  const [editingTarget, setEditingTarget] = useState<
    "none" | "title" | "description"
  >("none");
  const isEditing = editingTarget !== "none";

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

  const nonOrderableTypes = [
    "WELCOME_SCREEN",
    "INSTRUCTIONS",
    "EMAIL_CONTACT",
    "END_SCREEN",
  ];

  const isNonOrderableType = nonOrderableTypes.includes(type!);

  const [updateElementText] = useUpdateElementTextMutation();
  const [updateElementDescription] = useUpdateElementDescriptionMutation();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const initialRef = useRef<{ title: string; description: string }>({
    title: "",
    description: "",
  });

  const textTimerRef = useRef<number | null>(null);
  const descTimerRef = useRef<number | null>(null);

  const normalize = useCallback(
    (s: string | undefined | null) => (s ?? "").trim(),
    []
  );

  const handleEditClick = (target: "title" | "description") => {
    initialRef.current = {
      title: normalize(text),
      description: normalize(description),
    };
    setEditingTarget(target);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    // ✅ Instant UI: update selectedQuestion slice immediately
    dispatch(updateQuestionField({ key: "text", value: next }));

    // ✅ Debounced: update element-level slice after user pauses typing
    if (textTimerRef.current) window.clearTimeout(textTimerRef.current);
    textTimerRef.current = window.setTimeout(() => {
      if (questionID) {
        dispatch(updateElementField({ questionID, key: "text", value: next }));
      }
    }, DEBOUNCE_MS) as unknown as number;
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const next = event.target.value;
    // ✅ Instant UI
    dispatch(updateQuestionField({ key: "description", value: next }));

    // ✅ Debounced element update
    if (descTimerRef.current) window.clearTimeout(descTimerRef.current);
    descTimerRef.current = window.setTimeout(() => {
      if (questionID) {
        dispatch(
          updateElementField({ questionID, key: "description", value: next })
        );
      }
    }, DEBOUNCE_MS) as unknown as number;
  };

  const checkSaveTitle = useCallback(() => {
    if (!questionID) return;
    // ✅ Prevent empty titles
    const next = normalize(text) || "Untitled"; // <-- change fallback text here if you prefer
    const prev = normalize(initialRef.current.title); // ✅ Compare against snapshot taken at edit start
    if (next !== prev) {
      updateElementText({ questionID, text: next });
    }
  }, [questionID, text, normalize, updateElementText]);

  const checkSaveDescription = useCallback(() => {
    if (!questionID) return;
    // ✅ Keep empty description so your UI shows placeholder.
    // If you want to force a non-empty default, replace "" with "Description (optional)" below.
    const next = normalize(description); /* || "Description (optional)" */ // ✅ Toggle if you want non-empty
    const prev = normalize(initialRef.current.description);
    if (next !== prev) {
      updateElementDescription({ questionID, description: next });
    }
  }, [questionID, description, normalize, updateElementDescription]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setEditingTarget("none");
    } else if (event.key === "Enter") {
      if (questionID) {
        if (editingTarget === "title") {
          checkSaveTitle();
        } else if (editingTarget === "description") {
          checkSaveDescription();
        }
        setEditingTarget("none");
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    if (!isEditing) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current) return;
      const clickedInside = rootRef.current.contains(e.target as Node);
      if (!clickedInside) {
        // ✅ Outside click → save both (each with diff-check) and exit
        checkSaveTitle();
        checkSaveDescription();
        setEditingTarget("none");
      }
    };

    document.addEventListener("pointerdown", onPointerDown, true); // capture phase
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [isEditing, checkSaveTitle, checkSaveDescription]);

  // -- cleanup debounce timers on unmount -------------------------------------
  useEffect(() => {
    return () => {
      if (textTimerRef.current) window.clearTimeout(textTimerRef.current); // ✅ Cleanup
      if (descTimerRef.current) window.clearTimeout(descTimerRef.current); // ✅ Cleanup
    };
  }, []);

  return (
    <Box
      ref={rootRef}
      sx={{
        transformOrigin: "bottom",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        // border: "2px dashed orange",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          margin: "auto",
          // marginTop: "12%",
          width: display === "mobile" ? "92%" : "98%",
          // border: "2px solid green",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            width: "100%",
            // border: "2px solid green",
          }}
        >
          {!isNonOrderableType &&
            typeof order === "number" &&
            order > 0 &&
            order < 9999 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: { md: `${circleSizeMD}px`, xl: `${circleSizeXL}px` },
                  height: { md: `${circleSizeMD}px`, xl: `${circleSizeXL}px` },
                  borderRadius: "50%",
                  backgroundColor: primary.light,
                  marginRight: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    // fontSize: display === "mobile" ? "32px" : orderFontSize || 20,
                    fontSize: orderFontSize || 20,
                  }}
                >
                  {order}
                </Typography>
              </Box>
            )}
          <Box
            onClick={!isEditing ? () => handleEditClick("title") : undefined}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              cursor: editingTarget === "title" ? "text" : "pointer",
              // border: "2px solid orange",
            }}
          >
            {editingTarget === "title" ? (
              <TextField
                autoFocus
                id="outlined-basic"
                type="text"
                value={text}
                onChange={handleChangeText}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  backgroundColor: "transparent",
                  fontStyle: "italic",
                  fontSize: "3.75rem",
                  width: "100%",
                  "& .MuiInputBase-input": {
                    fontSize: "2rem",
                  },
                  fontFamily:
                    "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                }}
              />
            ) : (
              <Typography
                sx={{
                  whiteSpace: "normal",
                  width: "100%",
                  maxWidth: "80ch",
                  fontStyle: "normal",
                  fontFamily:
                    "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  fontSize:
                    display === "mobile" ? titleFontSizeMobile : titleFontSize,
                  textAlign: "start",
                  color: titleTextColor,
                  lineHeight: 1.4,
                  overflowWrap: "break-word",
                  hyphens: "auto",
                  letterSpacing: "0.01em",
                  wordSpacing: "0.05em",
                }}
              >
                {text}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            margin: display === "mobile" ? "8% auto" : "1% auto",
            // border: "2px solid black",
          }}
        >
          <Box
            onClick={
              !isEditing ? () => handleEditClick("description") : undefined
            }
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              cursor: editingTarget === "description" ? "text" : "pointer",
            }}
          >
            {editingTarget === "description" ? (
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="text"
                value={description}
                onChange={handleChangeDescription}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  backgroundColor: "transparent",
                  "& .MuiInputBase-input": {
                    fontSize: "1.6rem",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontStyle: "italic",
                  fontFamily:
                    "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  whiteSpace: "normal",
                  width: "fit-content",
                  fontSize:
                    display === "mobile"
                      ? descriptionFontSizeMobile
                      : descriptionFontSize,
                  color: descriptionTextColor,
                }}
              >
                {normalize(description) === ""
                  ? "Description (optional)"
                  : description}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ElementQuestionText;
