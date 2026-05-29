import { Box } from "@mui/material";

import { ThreeDHeatmapInsightsSectionProps } from "../../../types/behaviorTypes";

import { ThreeDHeatmapCard } from "./ThreeDHeatmapCard";
import { ThreeDInsightsColumn } from "./ThreeDInsightsColumns";

export function ThreeDHeatmapInsightsSection({
  data,
  modelUrl,
  heatmapMode,
  onHeatmapModeChange,
  activeHeatmapData,
}: ThreeDHeatmapInsightsSectionProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1.6fr 1fr" },
        gap: 2.5,
        alignItems: "start",
      }}
    >
      {/* Left: 3D model heatmap card */}
      <ThreeDHeatmapCard
        modelUrl={modelUrl}
        heatmapMode={heatmapMode}
        onHeatmapModeChange={onHeatmapModeChange}
        activeHeatmapData={activeHeatmapData}
      />

      {/* Right: insight column */}
      <ThreeDInsightsColumn data={data} />
    </Box>
  );
}
