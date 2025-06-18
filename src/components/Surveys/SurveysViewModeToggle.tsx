import GridViewIcon from "@mui/icons-material/GridView";
import ReorderIcon from "@mui/icons-material/Reorder";
import { Box, IconButton } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { SurveyViewModeProps } from "../../utils/types";

const SurveysViewModeToggle = ({
  viewMode,
  setViewMode,
}: SurveyViewModeProps) => {
  const { primary, background } = useAppTheme();
  return (
    <Box
      sx={{
        display: "flex",
        height: "28px",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "4px",
        boxShadow: 1,
        border: "1px solid #E6E8EC",
      }}
    >
      <IconButton
        onClick={() => setViewMode("list")}
        sx={{
          padding: "8px",
          borderRadius: "6px",
          backgroundColor:
            viewMode === "list" ? background.soft4 : "transparent",
          color: viewMode === "list" ? primary.dark : primary.main,
          "&:hover": {
            color: primary.dark,
            backgroundColor:
              viewMode === "list" ? background.soft4 : "transparent",
          },
        }}
      >
        <ReorderIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <IconButton
        onClick={() => setViewMode("grid")}
        sx={{
          padding: "8px",
          borderRadius: "6px",
          backgroundColor:
            viewMode === "grid" ? background.soft4 : "transparent",
          color: viewMode === "grid" ? primary.dark : primary.main,
          "&:hover": {
            color: primary.dark,
            backgroundColor:
              viewMode === "grid" ? background.soft4 : "transparent",
          },
        }}
      >
        <GridViewIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
};

export default SurveysViewModeToggle;
