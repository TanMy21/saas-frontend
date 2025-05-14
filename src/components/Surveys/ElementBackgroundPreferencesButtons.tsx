import { useState } from "react";

import { IconButton, Tooltip } from "@mui/material";
import { FaRegImage } from "react-icons/fa6";
import { IoColorPaletteSharp } from "react-icons/io5";

import { ElementImageIconButtonsProps } from "../../utils/types";
import QuestionTemplateImageUpload from "../Modals/QuestionTemplateImageUpload";

const ElementBackgroundPreferencesButtons = ({
  questionID,
  setColorAnchorEl,
}: ElementImageIconButtonsProps) => {
  const [uploadImageModalOpen, setUploadImageModalOpen] =
    useState<boolean>(false);

  return (
    <>
      {/* Left Top Icon */}
      <Tooltip title="Question background template">
        <IconButton
          className="template-icon-btn"
          onClick={() => setUploadImageModalOpen(true)}
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 2,
            backgroundColor: "#FFFFFF",
            color: "#424242",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "#F5F5F5",
            },
          }}
        >
          <FaRegImage />
        </IconButton>
      </Tooltip>
      {/* Upload Image Modal */}
      <QuestionTemplateImageUpload
        uploadImageModalOpen={uploadImageModalOpen}
        setUploadImageModalOpen={setUploadImageModalOpen}
        questionID={questionID}
      />
      {/* Right Top Icon */}
      <Tooltip title="Question background color">
        <IconButton
          onClick={(e) => setColorAnchorEl(e.currentTarget)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: "#FFFFFF",
            color: "#424242",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "#F5F5F5",
            },
          }}
        >
          <IoColorPaletteSharp />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ElementBackgroundPreferencesButtons;
