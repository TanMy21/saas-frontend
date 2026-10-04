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
            width: 40,
            height: 40,
            padding: 0,
            fontSize: 20,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            color: "#424242",
            border: "1px solid rgba(15, 23, 42, 0.06)",
            boxShadow:
              "0 2px 6px rgba(15, 23, 42, 0.10), 0 1px 2px rgba(15, 23, 42, 0.06)",
            transition: "background-color 160ms ease, box-shadow 160ms ease",
            "&:hover": {
              backgroundColor: "#F8FAFC",
              boxShadow:
                "0 4px 12px rgba(15, 23, 42, 0.16), 0 1px 3px rgba(15, 23, 42, 0.08)",
            },
            "&.Mui-focusVisible": {
              outline: "2px solid #1976D2",
              outlineOffset: 3,
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
            width: 40,
            height: 40,
            padding: 0,
            fontSize: 20,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            color: "#424242",
            border: "1px solid rgba(15, 23, 42, 0.06)",
            boxShadow:
              "0 2px 6px rgba(15, 23, 42, 0.10), 0 1px 2px rgba(15, 23, 42, 0.06)",
            transition: "background-color 160ms ease, box-shadow 160ms ease",
            "&:hover": {
              backgroundColor: "#F8FAFC",
              boxShadow:
                "0 4px 12px rgba(15, 23, 42, 0.16), 0 1px 3px rgba(15, 23, 42, 0.08)",
            },
            "&.Mui-focusVisible": {
              outline: "2px solid #1976D2",
              outlineOffset: 3,
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
