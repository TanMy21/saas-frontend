import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const CenteredStack = ({
  children,
  marginBottomOveride,
  marginTopOveride,
  display,
  // className = "",
}: ScreenLayoutProps) => {
  return (
    <Box
      sx={{
        width: display === "mobile" ? "92%" : "80%",
        maxWidth: display === "mobile" ? "92%" : "80%",
        display: "flex",
        alignItems: "flex-start",
        border: "2px solid black",
        gap: { xs: 1.5, md: 3 },
        mx: "auto",
        mt: marginTopOveride ?? "8%",
        mb: marginBottomOveride ?? "2%",
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredStack;
