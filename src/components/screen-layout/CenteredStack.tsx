import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const CenteredStack = ({
  children,
  widthOverride,
  marginBottomOveride,
  className = "",
}: ScreenLayoutProps) => {
  return (
    <Box
      sx={{
        // position:"absolute",
        display: "flex",
        marginX: "auto",
        flexDirection: "row",
        mt: "clamp(16px, 18vh, 160px)",
        flexShrink: 0,
        marginBottom: marginBottomOveride ?? "2%",
        width: widthOverride ?? "98%",
        zIndex: 10,
        border: "2px solid red",
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredStack;
