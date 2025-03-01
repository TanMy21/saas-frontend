import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";

const MediaElementClearIconButton = () => {
  return (
    <IconButton
      className="close-button"
      z-index={10}
      sx={{
        position: "relative",
        top: { lg: "-82%", xl: "-84%" },
        right: { lg: "-44%", xl: "-50%" },
        transform: "translateY(-80%)",
        visibility: "visible",
        width: "24px",
        height: "24px",
        backgroundColor: "red",
        color: "white",
        "&:hover": {
          backgroundColor: "darkred",
          visibility: "visible",
        },
      }}
    >
      <ClearIcon />
    </IconButton>
  );
};

export default MediaElementClearIconButton;
