import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const ResponseContainer = ({
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
        marginBottom: "4%",
        width: display === "desktop" ? "80%" : "98%",
        zIndex: 10,
        border: "2px solid red",
      }}
    >
      {children}
    </Box>
  );
};

export default ResponseContainer;
