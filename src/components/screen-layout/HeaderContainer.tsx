import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const HeaderContainer = ({
  children,
  display,
  marginTopOveride,
  marginBottomOveride,
  // className = "",
}: ScreenLayoutProps) => {
  return (
    <Box
      sx={{
        width: display === "mobile" ? "92%" : "98%",
        maxWidth: display === "mobile" ? "92%" : "98%",
        display: "flex",
        alignItems: "flex-start",
        gap: { xs: 1.5, md: 3 },
        mx: "auto",
        mt: marginTopOveride ?? "0%",
        mb: marginBottomOveride ?? "2%",
        // border: "2px solid green",
      }}
    >
      {children}
    </Box>
  );
};

export default HeaderContainer;
