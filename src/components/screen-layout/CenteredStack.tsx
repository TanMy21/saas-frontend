import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const CenteredStack = ({
  children,
  widthOverride,
  marginBottomOveride,
  marginTopOveride,
  className = "",
}: ScreenLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        marginX: "auto",
        flexDirection: "row",
        mt: marginTopOveride ?? "1px",
        flexShrink: 0,
        marginBottom: marginBottomOveride ?? "2%",
        width: widthOverride ?? "98%",
        zIndex: 10,
        // border: "2px solid red",
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredStack;
