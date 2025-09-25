import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const CenteredStack = ({
  children,
  display = "desktop",
  className = "",
}: ScreenLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        marginX: "auto",
        flexDirection: "row",
        marginBottom: "2%",
        width: display === "desktop" ? "80%" : "98%",
        zIndex: 10,
        border: "2px solid red",
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredStack;
