import { useEffect, useRef, useState } from "react";

import { Box, Popover } from "@mui/material";
import { Chrome } from "@uiw/react-color";
import { debounce } from "lodash";

import { useUpdateQuestionBackgroundColorMutation } from "../../../../app/slices/elementApiSlice";
import { setBackgroundColor } from "../../../../app/slices/elementSlice";
import { updateElementField } from "../../../../app/slices/surveySlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import {
  QuestionBackgroundColorProps,
  SurveyCanvasQuestionSettings,
} from "../../../../utils/types";

const QuestionBackgroundColor = ({
  questionID,
  colorAnchorEl,
  setColorAnchorEl,
}: QuestionBackgroundColorProps) => {
  const dispatch = useAppDispatch();

  const [updateQuestionBackgroundColor] =
    useUpdateQuestionBackgroundColorMutation();

  const selectedQuestion = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const bgColor =
    selectedQuestion?.questionPreferences?.questionBackgroundColor;

  const [localColor, setLocalColor] = useState(bgColor || "#ffffff");

  /**
   * Debounced API updater.
   * does NOT recreate on every render.
   */
  const debouncedSaveRef = useRef(
    debounce(async (qID: string, colorHex: string) => {
      try {
        await updateQuestionBackgroundColor({
          questionID: qID,
          questionBackgroundColor: colorHex,
        }).unwrap();
      } catch (error) {
        console.error("Failed to update background color:", error);
      }
    }, 400),
  );

  const handleColorChange = (color: any) => {
    const hexColor = color.hex;

    dispatch(setBackgroundColor(hexColor));

    dispatch(
      updateElementField({
        questionID,
        key: "questionPreferences",
        value: {
          ...(selectedQuestion?.questionPreferences ?? {}),
          questionBackgroundColor: hexColor,
        } as SurveyCanvasQuestionSettings,
      }),
    );
    setLocalColor(hexColor);

    // debounced backend update
    if (questionID) {
      debouncedSaveRef.current(questionID, hexColor);
    }
  };

  // Sync local state when Redux changes.

  useEffect(() => {
    setLocalColor(bgColor || "#ffffff");
  }, [bgColor]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSaveRef.current.cancel();
    };
  }, []);

  return (
    <Popover
      open={Boolean(colorAnchorEl)}
      anchorEl={colorAnchorEl}
      onClose={() => setColorAnchorEl(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Box sx={{ p: 2 }}>
        <Chrome
          color={localColor}
          onChange={handleColorChange}
          style={{ boxShadow: "none" }}
        />
      </Box>
    </Popover>
  );
};

export default QuestionBackgroundColor;
