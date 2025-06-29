import { Box, IconButton, Paper } from "@mui/material";
import { CiMobile3, CiMonitor } from "react-icons/ci";

import { useAppTheme } from "../../../../theme/useAppTheme";
import { TypographySettingsView } from "../../../../utils/types";

const FontSizeViewToggle = ({ view, setView }: TypographySettingsView) => {
  const { primary, grey } = useAppTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          height: "36px",
          p: 0.5,
          backgroundColor: grey[100],
        }}
      >
        <IconButton
          onClick={() => setView("desktop")}
          title="Desktop font size"
          sx={{
            p: 1,
            borderRadius: 1,
            transition: "all 0.2s",
            color: view === "desktop" ? primary.main : grey[700],
            backgroundColor: view === "desktop" ? "white" : "transparent",
            boxShadow: view === "desktop" ? 1 : "none",
            "&:hover": {
              color: view === "desktop" ? primary.main : grey[700],
            },
          }}
        >
          <CiMonitor style={{ fontSize: "20px" }} />
        </IconButton>

        <IconButton
          onClick={() => setView("mobile")}
          title="Mobile font size"
          sx={{
            p: 1,
            borderRadius: 1,
            transition: "all 0.2s",
            color: view === "mobile" ? primary.main : grey[700],
            backgroundColor: view === "mobile" ? "white" : "transparent",
            boxShadow: view === "mobile" ? 1 : "none",
            "&:hover": {
              color: view === "mobile" ? primary.main : grey[700],
            },
          }}
        >
          <CiMobile3 style={{ fontSize: "20px" }} />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default FontSizeViewToggle;
