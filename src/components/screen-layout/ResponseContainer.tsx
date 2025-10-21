import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const ResponseContainer = ({
  children,
  marginTopOveride,display,
  // className = "",
}: ScreenLayoutProps) => {
  return (
    <Box
      sx={{
        width: display === "desktop" ? "80%" : "96%",
        maxWidth: display === "desktop" ? "80%" : "92%",
        mx: "auto",
        mt: marginTopOveride ?? "2%",
        mb: "4%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        px: { xs: 2, md: 1 },
        py: { xs: 2, md: 1 },
      }}
    >
      {children}
    </Box>
  );
};

export default ResponseContainer;
