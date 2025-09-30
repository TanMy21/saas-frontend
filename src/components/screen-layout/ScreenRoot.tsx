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
        // paddingTop:"16%",
        gap: "1%",
        margin: "auto",
        width: "98%",
        // height:"82vh",
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
