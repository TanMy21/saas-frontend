import { Box, styled } from "@mui/material";

export const CustomTrackContainer = styled(Box)({
  position: "absolute",
  top: "50%",
  left: 0,
  width: "100%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
});
