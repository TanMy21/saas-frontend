import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ImageIcon from "@mui/icons-material/Image";
import { Box, IconButton, Tooltip } from "@mui/material";

import { useRemoveImageMutation } from "../../app/slices/optionApiSlice";
import { MediaElementCardIconBtnProps } from "../../utils/types";

const MediaElementCardIconBtns = ({
  optionID,
  handleOpen,
  isHovered
}: MediaElementCardIconBtnProps) => {
  const [removeImage] = useRemoveImageMutation();

  const handleRemoveImage = async (optionID: string) => {
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
        position: "absolute",
        top: "4%",
        right: "4%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        backgroundColor: "transparent",
        alignSelf: "end",
        gap: 1,
        visibility: isHovered ? "visible" : "hidden",
        opacity: isHovered ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <Tooltip title="Replace">
        <IconButton
          onClick={() => handleOpen(optionID)}
          sx={{
            backgroundColor: "#E3E3E3",
            color: "#3A3A3A",
            width: "28px",
            height: "28px",
            borderRadius: "8%",
            "&:hover": {
              backgroundColor: "#E3E3E3",
              color: "#3A3A3A",
            },
          }}
        >
          <ImageIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Remove">
        <IconButton
          onClick={() => handleRemoveImage(optionID)}
          sx={{
            width: "28px",
            height: "28px",
            borderRadius: "8%",
            backgroundColor: "#E3E3E3",
            color: "#3A3A3A",
            "&:hover": {
              backgroundColor: "#E3E3E3",
              color: "#3A3A3A",
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
