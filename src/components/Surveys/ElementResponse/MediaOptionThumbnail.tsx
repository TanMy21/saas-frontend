import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { Box, Typography } from "@mui/material";

import { getSquareImageURL } from "../../../utils/utils";

type MediaOptionThumbnailProps = {
  imageSrc: string | null;
  label: string;
  canEdit: boolean;
  isSelected: boolean;
  onClick: () => void;
};

const MediaOptionThumbnail = ({
  imageSrc,
  label,
  canEdit,
  isSelected,
  onClick,
}: MediaOptionThumbnailProps) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    aria-label={
      imageSrc ? `Select ${label}` : `Select ${label} and add an image`
    }
    sx={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      display: "flex",
      width: "100%",
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      borderRadius: "14px",
      border: isSelected ? "2px solid #0074EB" : "1px solid transparent",
      backgroundColor: "#F4F3F0",
      cursor: canEdit || imageSrc ? "pointer" : "default",
      transition:
        "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
      "&:hover": {
        borderColor: isSelected ? "#005BC4" : "#0074EB",
        boxShadow: "0 2px 7px rgba(24, 33, 43, 0.08)",
      },
      "&:focus-visible": {
        outline: "3px solid rgba(0, 116, 235, 0.20)",
        outlineOffset: 3,
      },
    }}
  >
    {imageSrc ? (
      <Box
        component="img"
        src={getSquareImageURL(imageSrc)}
        alt={label}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    ) : (
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
          color: "#73777F",
        }}
      >
        <InsertPhotoIcon sx={{ fontSize: 34, color: "#9AA0A8" }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          No image yet
        </Typography>
        {canEdit && (
          <Typography sx={{ fontSize: 12, color: "#8C9199" }}>
            Add image
          </Typography>
        )}
      </Box>
    )}
  </Box>
);

export default MediaOptionThumbnail;
