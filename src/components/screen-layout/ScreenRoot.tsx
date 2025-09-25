import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const ScreenRoot = ({ children }: ScreenLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent:"center",
        alignItems: "center",
        gap: "1%",
        margin: "auto",
        width: "98%",
        minHeight: "700px",
        zIndex: 20,
        border: "2px solid black",
      }}
    >
      {children}
    </Box>
  );
};

export default ScreenRoot;
