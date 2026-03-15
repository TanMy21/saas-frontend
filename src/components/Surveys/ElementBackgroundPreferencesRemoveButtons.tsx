import { IconButton, Tooltip } from "@mui/material";
import { FcRemoveImage } from "react-icons/fc";
import { MdOutlineFormatColorReset } from "react-icons/md";

import {
  useRemoveQuestionBackgroundColorMutation,
  useRemoveQuestionTemplateImageMutation,
} from "../../app/slices/elementApiSlice";
import {
  removeBackgroundColor,
  removeTemplateImage,
} from "../../app/slices/elementSlice";
import { updateElementField } from "../../app/slices/surveySlice";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/typedReduxHooks";
import {
  ElementBackgroundPreferencesRemoveButtonsProps,
  SurveyCanvasQuestionSettings,
} from "../../utils/types";

const ElementBackgroundPreferencesRemoveButtons = ({
  questionID,
  templateImage,
  questionBackgroundColor,
}: ElementBackgroundPreferencesRemoveButtonsProps) => {
  const dispatch = useAppDispatch();

  const [removeQuestionTemplateImage] =
    useRemoveQuestionTemplateImageMutation();

  const [removeQuestionBackgroundColor] =
    useRemoveQuestionBackgroundColorMutation();

  const deleteTemplateImage = async () => {
    try {
      await removeQuestionTemplateImage(questionID).unwrap();
      dispatch(removeTemplateImage());
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveBackgroundColor = async () => {
    try {
      dispatch(removeBackgroundColor());

      dispatch(
        updateElementField({
          questionID,
          key: "questionPreferences",
          value: {
            questionBackgroundColor: undefined,
          } as SurveyCanvasQuestionSettings,
        }),
      );

      await removeQuestionBackgroundColor(questionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const hasBackgroundColor =
    questionBackgroundColor &&
    questionBackgroundColor.trim() !== "" &&
    questionBackgroundColor.toLowerCase() !== "#ffffff";

  return (
    <>
      {/* Left Top Icon */}
      {templateImage && (
        <Tooltip title="Remove question background template">
          <IconButton
            className="template-icon-btn"
            onClick={deleteTemplateImage}
            sx={{
              position: "absolute",
              top: 8,
              left: "50%",
              cursor: "grab",
              transform: "translateX(-50%)",
              zIndex: 20,
              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
            }}
          >
            <FcRemoveImage />
          </IconButton>
        </Tooltip>
      )}
      {/* Right Top Icon */}
      {hasBackgroundColor && (
        <Tooltip title="Remove question background color">
          <IconButton
            onClick={handleRemoveBackgroundColor}
            sx={{
              position: "absolute",
              top: 5,
              right: 60,
              fontSize: 28,
              zIndex: 1,
              color: "red",
            }}
          >
            <MdOutlineFormatColorReset />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default ElementBackgroundPreferencesRemoveButtons;
