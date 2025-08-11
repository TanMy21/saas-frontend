import { useRef } from "react";

import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import {
  useUpdateElementDescriptionMutation,
  useUpdateElementTextMutation,
} from "../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../app/slices/elementSlice";
import { updateElementField } from "../../../app/slices/surveySlice";
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

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    dispatch(updateQuestionField({ key: "text", value: next }));
    debouncedUpdate("text", next);
  };

  const handleChangeDesc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    dispatch(updateQuestionField({ key: "description", value: next }));
    debouncedUpdate("description", next);
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

  useOutsideSave(Boolean(editingTarget !== "none"), rootRef, () => {
    clearTimers();
    saveTitleIfChanged();
    saveDescriptionIfChanged();
    endEdit();
  });

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
        {/* Title row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            width: "100%",
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

          <EditableLine
            active={editingTarget === "title"}
            value={text}
            placeholder={undefined}
            onStartEdit={() => beginEdit("title")}
            onChange={handleChangeTitle}
            onKeyDown={handleKeyDown}
            textFieldId="title-input"
            cursorWhenActive="text"
            textFieldSx={{
              backgroundColor: "transparent",
              fontStyle: "italic",
              fontSize: "3.75rem",
              width: "100%",
              "& .MuiInputBase-input": { fontSize: "2rem" },
              fontFamily:
                "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
                "&:hover fieldset": { border: "none" },
                "&.Mui-focused fieldset": { border: "none" },
              },
            }}
            typographySx={{
              whiteSpace: "normal",
              width: "100%",
              maxWidth: "80ch",
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
          />
        </Box>

        {/* Description row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            margin: display === "mobile" ? "8% auto" : "1% auto",
          }}
        >
          <EditableLine
            active={editingTarget === "description"}
            value={description}
            placeholder="Description (optional)"
            onStartEdit={() => beginEdit("description")}
            onChange={handleChangeDesc}
            onKeyDown={handleKeyDown}
            textFieldId="description-input"
            cursorWhenActive="text"
            textFieldSx={{
              backgroundColor: "transparent",
              "& .MuiInputBase-input": { fontSize: "1.6rem" },
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
            }}
            typographySx={{
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
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ElementQuestionText;
