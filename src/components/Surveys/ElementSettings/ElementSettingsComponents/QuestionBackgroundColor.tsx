import { useEffect, useState } from "react";

import { Box, Popover } from "@mui/material";
import { Chrome } from "@uiw/react-color";
import { debounce } from "lodash";

import { useUpdateQuestionBackgroundColorMutation } from "../../../../app/slices/elementApiSlice";
import { setBackgroundColor } from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { QuestionBackgroundColorProps } from "../../../../utils/types";

const QuestionBackgroundColor = ({
  questionID,
  colorAnchorEl,
  setColorAnchorEl,
}: QuestionBackgroundColorProps) => {
  const dispatch = useAppDispatch();
  const [updateQuestionBackgroundColor] =
    useUpdateQuestionBackgroundColorMutation();
  const bgColor = useAppSelector(
    (state: RootState) =>
      state.question.selectedQuestion?.questionPreferences
        ?.questionBackgroundColor
  );

  const [localColor, setLocalColor] = useState(bgColor || "#ffffff");

  const debouncedUpdateColor = debounce(async (colorHex: string) => {
    if (questionID) {
      try {
        await updateQuestionBackgroundColor({
          questionID,
          questionBackgroundColor: colorHex,
        });
      } catch (error) {
        console.error("Failed to update background color:", error);
      }
    }
  }, 300);

  const handleColorChange = (color: any) => {
    const hexColor = color.hex;

    dispatch(setBackgroundColor(hexColor));
    setLocalColor(hexColor);

    debouncedUpdateColor(hexColor);
  };

  useEffect(() => {
    console.log("🔁 bgColor in QuestionBackgroundColor:", bgColor);
    setLocalColor(bgColor || "#ffffff");
  }, [bgColor]);

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
