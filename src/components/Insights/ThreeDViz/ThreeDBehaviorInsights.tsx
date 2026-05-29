import { useMemo, useState } from "react";

import { Box, Skeleton, Typography } from "@mui/material";

import {
  HeatmapMode,
  ThreeDBehaviorInsightsProps,
} from "../../../types/behaviorTypes";
import { withAreaColors } from "../../../utils/utils";

import { ThreeDBehaviorSummaryCards } from "./ThreeDBehaviorSummaryCards";
import { ThreeDBehaviorDetailsTabs } from "./ThreeDBehaviorTabs";
import { ThreeDHeatmapInsightsSection } from "./ThreeDHeatmapInsightsSection";

function ThreeDBehaviorInsightsSkeleton() {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Summary card skeleton row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Skeleton variant="text" width="70%" height={24} />
            <Skeleton variant="text" width="45%" height={36} />
            <Skeleton variant="text" width="85%" height={20} />
          </Box>
        ))}
      </Box>

      {/* Behavior comparison skeleton */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={220} />
      </Box>

      {/* Heatmap and model area skeleton */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Skeleton variant="rounded" height={300} />
        <Skeleton variant="rounded" height={300} />
      </Box>
    </Box>
  );
}

export function ThreeDBehaviorInsights({
  data,
  isLoading,
  modelUrl,
}: ThreeDBehaviorInsightsProps) {
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>("ALL");

  const activeHeatmapData = useMemo(() => {
    if (heatmapMode === "LIKE") {
      return {
        clickedMeshes: data?.modelAreas?.likedClickedMeshes ?? [],
        surfaceClickSamples: data?.likedSurfaceClickSamples ?? [],
        label: "Liked users",
      };
    }

    if (heatmapMode === "DISLIKE") {
      return {
        clickedMeshes: data?.modelAreas?.dislikedClickedMeshes ?? [],
        surfaceClickSamples: data?.dislikedSurfaceClickSamples ?? [],
        label: "Disliked users",
      };
    }

    return {
      clickedMeshes: data?.modelAreas?.clickedMeshes ?? [],
      surfaceClickSamples: data?.surfaceClickSamples ?? [],
      label: "All users",
    };
  }, [data, heatmapMode]);

  const coloredActiveAreas = useMemo(
    () => withAreaColors(activeHeatmapData.clickedMeshes.slice(0, 8)),
    [activeHeatmapData.clickedMeshes],
  );

  if (isLoading) {
    return <ThreeDBehaviorInsightsSkeleton />;
  }

  if (!data) {
    return (
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography color="text.secondary" fontSize={14}>
          No 3D behavior data available yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {/* Summary cards should appear before the model heatmap. */}
      <ThreeDBehaviorSummaryCards data={data} />

      {/* Main model heatmap + insight cards split. */}

      <ThreeDHeatmapInsightsSection
        data={data}
        modelUrl={modelUrl}
        heatmapMode={heatmapMode}
        onHeatmapModeChange={setHeatmapMode}
        activeHeatmapData={{
          ...activeHeatmapData,
          clickedMeshes: coloredActiveAreas,
        }}
      />
      {/* 3D behavior tabs */}
      <ThreeDBehaviorDetailsTabs data={data} activeAreas={coloredActiveAreas} />
    </Box>
  );
}
