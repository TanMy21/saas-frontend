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
  setBackgroundColor,
} from "../../app/slices/elementSlice";
import { useAppDispatch } from "../../app/typedReduxHooks";
import { ElementBackgroundPreferencesRemoveButtonsProps } from "../../utils/types";

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
      console.log("questionID", questionID);
      await removeQuestionBackgroundColor(questionID).unwrap();
      dispatch(removeBackgroundColor());
      console.log("Background color removed successfully");
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
              zIndex: 2,
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
