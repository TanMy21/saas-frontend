import GridViewIcon from "@mui/icons-material/GridView";
import ReorderIcon from "@mui/icons-material/Reorder";
import { Box, IconButton } from "@mui/material";

import { SurveyViewModeProps } from "../../utils/types";

const SurveysViewModeToggle = ({
  viewMode,
  setViewMode,
}: SurveyViewModeProps) => {
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
          backgroundColor: viewMode === "list" ? "#EDE9FE" : "transparent",
          color: viewMode === "list" ? "#7C39ED" : "#777E8B",
          "&:hover": {
            color: "#7B39ED",
            backgroundColor: viewMode === "list" ? "#EDE9FE" : "transparent",
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
          backgroundColor: viewMode === "grid" ? "#EDE9FE" : "transparent",
          color: viewMode === "grid" ? "#7C39ED" : "#6B7280",
          "&:hover": {
            color: "#7B39ED",
            backgroundColor: viewMode === "grid" ? "#EDE9FE" : "transparent",
          },
        }}
      >
        <GridViewIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
};

export default SurveysViewModeToggle;
