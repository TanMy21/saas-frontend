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
    <Box
      ref={rootRef}
      sx={{
        transformOrigin: "bottom",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          margin: "auto",
          width: display === "mobile" ? "92%" : "98%",
        }}
      >
        {/* Title row */}
        <Box
          onMouseDown={(e) => {
            if (editingTarget !== "none") e.preventDefault();
          }}
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            width: "80%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "8%",
              height: "98%",
              justifyContent: "center",
              alignItems: "center",
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

          <EditableLine
            active={editingTarget === "title"}
            value={text}
            placeholder={undefined}
            onStartEdit={() => beginEdit("title")}
            onChange={handleChangeTitle}
            onFormatted={() => {
              saveTitleIfChanged();
            }}
            onKeyDown={handleKeyDown}
            textFieldId="title-input"
            cursorWhenActive="text"
            textFieldSx={{
              backgroundColor: "transparent",
              fontStyle: "italic",
              width: "100%",
              fontFamily:
                "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
              fontSize: textFontSize,
              lineHeight: 1.4,
              letterSpacing: "0.01em",
              "& *": {
                fontFamily: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
              },
            }}
            typographySx={{
              whiteSpace: "normal",
              width: "100%",
              maxWidth: "80ch",
              fontFamily:
                "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
              fontSize: textFontSize,
              textAlign: "start",
              color: titleTextColor,
              lineHeight: 1.4,
              overflowWrap: "break-word",
              hyphens: "auto",
              letterSpacing: "0.01em",
              wordSpacing: "0.05em",
              "& *": {
                fontFamily: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
              },
            }}
          />
        </Box>

        {/* Description row */}
        <Box
          onMouseDown={(e) => {
            if (editingTarget !== "none") e.preventDefault();
          }}
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
            margin: display === "mobile" ? "8% auto" : "1% auto",
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
  );
};

export default ElementQuestionText;
