import { useState } from "react";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ImageIcon from "@mui/icons-material/Image";
import { Box, IconButton, Tooltip } from "@mui/material";

import { useRemoveImageMutation } from "../../app/slices/optionApiSlice";
import { MediaElementCardIconBtnProps } from "../../utils/types";
import MediaElementImageUploadModal from "../Modals/MediaElementImageUploadModal";

const MediaElementCardIconBtns = ({
  optionID,
}: MediaElementCardIconBtnProps) => {
  const [replaceImageModalOpen, setReplaceImageModalOpen] =
    useState<boolean>(false);
  const [removeImage] = useRemoveImageMutation();

  const handleRemoveImage = async () => {
    try {
      await removeImage(optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      className="control-buttons"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        gap: 2,
        transition: "opacity 0.3s ease",
      }}
    >
      <Tooltip title="Replace Image">
        <IconButton
          onClick={() => setReplaceImageModalOpen(true)}
          sx={{
            backgroundColor: "white",
            color: "#848484",
            width: "28px",
            height: "28px",
            borderRadius: "8%",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "white",
              color: "#848484",
            },
          }}
        >
          <ImageIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <MediaElementImageUploadModal
        uploadImageModalOpen={replaceImageModalOpen}
        setUploadImageModalOpen={setReplaceImageModalOpen}
        optionID={optionID}
      />
      <Tooltip title="Remove Image">
        <IconButton
          onClick={handleRemoveImage}
          sx={{
            width: "28px",
            height: "28px",
            borderRadius: "8%",
            backgroundColor: "white",
            color: "#848484",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "white",
              color: "#848484",
            },
          }}
        >
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default MediaElementCardIconBtns;
