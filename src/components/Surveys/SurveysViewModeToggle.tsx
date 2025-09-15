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
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        height: "36px",
        backgroundColor: "white",
        borderRadius: 9999,
        padding: "4px",
        gap: 0.5,
        border: "1px solid #E6E8EC",
        boxShadow: "0 1px 2px rgba(2,43,103,0.06)",
        overflow: "hidden",
        backdropFilter: "saturate(120%) blur(2px)",
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 4,
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: background.soft4,
          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6)",
           pointerEvents: "none",             // prevent capturing clicks
          transform:
            viewMode === "list"
              ? "translateX(0)"              // under left tab
              : "translateX(calc(100% + 12px))", // 28px + 12px = 40px total travel
          transition: "transform 160ms ease",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      />

      <IconButton
        role="tab"
        aria-selected={viewMode === "list"}
        aria-label="List view"
        disableRipple
        onClick={() => setViewMode("list")}
        sx={{
          position: "relative",
          zIndex: 1,
          width:36,
          minWidth: 36,
          height: "100%",
          padding: 0,
          borderRadius: "50%",
          backgroundColor:
            viewMode === "list" ? background.soft4 : "transparent",
          color: viewMode === "list" ? primary.dark : primary.main,
          "&:hover": {
            color: primary.dark,
            transform: "translateY(-1px)",
            backgroundColor:
              viewMode === "list" ? background.soft4 : "transparent",
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: primary.dark,
            outlineOffset: "2px",
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "&:hover": { transform: "none" },
          },
        }}
      >
        <ReorderIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <IconButton
        role="tab"
        aria-selected={viewMode === "grid"}
        aria-label="Grid view"
        disableRipple
        onClick={() => setViewMode("grid")}
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          width:36,
          minWidth: 36,
          padding: 0,
          borderRadius: "50%",
          backgroundColor:
            viewMode === "grid" ? background.soft4 : "transparent",
          color: viewMode === "grid" ? primary.dark : primary.main,
          transition: "color 120ms ease, transform 120ms ease",
          "&:hover": {
            color: primary.dark,
            transform: "translateY(-1px)",
            backgroundColor:
              viewMode === "grid" ? background.soft4 : "transparent",
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: primary.dark,
            outlineOffset: "2px",
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "&:hover": { transform: "none" },
          },
        }}
      >
        <GridViewIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
};

export default SurveysViewModeToggle;
