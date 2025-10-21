import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const ScreenRoot = ({ children, display }: ScreenLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: display === "mobile" ? 0 : 0,
        transition: "all 300ms ease",
        margin: "auto",
        width: display === "mobile" ? "98%" : "96%",
        minHeight: "700px",
        zIndex: 20,
        border: "2px solid red",
      }}
    >
      {children}
    </Box>
  );
};

export default ScreenRoot;
