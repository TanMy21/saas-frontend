import { useState } from "react";

import { Box, Collapse, IconButton, Typography } from "@mui/material";
import { ChevronDown } from "lucide-react";

import {
  ColoredClickedMeshArea,
  HeatmapMode,
} from "../../../types/behaviorTypes";
import { SurfaceClickSample } from "../../../types/insightTypes";

import { ThreeDBehaviorViewer } from "./ThreeDBehaviorViewer";
import { ThreeDHeatmapModeToggle } from "./ThreeDHeatmapModeToggle";

export function ThreeDHeatmapCard({
  modelUrl,
  heatmapMode,
  onHeatmapModeChange,
  activeHeatmapData,
}: {
  modelUrl?: string;
  heatmapMode: HeatmapMode;
  onHeatmapModeChange: (mode: HeatmapMode) => void;
  activeHeatmapData: {
    clickedMeshes: ColoredClickedMeshArea[];
    surfaceClickSamples: SurfaceClickSample[];
    label: string;
  };
}) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const coloredClickedMeshes = activeHeatmapData.clickedMeshes;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: "none",
      }}
    >
      {/* Header and filter   */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box>
          <Typography fontSize={16} fontWeight={700} color="text.primary">
            Where viewers clicked on the model
          </Typography>

          <Typography fontSize={13} color="text.secondary" mt={0.25}>
            Showing: {activeHeatmapData.label}
          </Typography>
        </Box>

        <ThreeDHeatmapModeToggle
          value={heatmapMode}
          onChange={onHeatmapModeChange}
        />
      </Box>

      {/* 3D heatmap viewer */}
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          bgcolor: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
        }}
      >
        <ThreeDBehaviorViewer
          modelUrl={modelUrl}
          clickedMeshes={coloredClickedMeshes}
          surfaceClickSamples={activeHeatmapData.surfaceClickSamples}
        />
      </Box>

      {/* Clicked regions */}
      <Box>
        <Typography fontSize={14} fontWeight={600} color="text.primary" mb={1}>
          Clicked regions
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {coloredClickedMeshes.length ? (
            coloredClickedMeshes.map((area) => (
              <Box
                key={`${area.meshName}-${area.materialName ?? "none"}`}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: `${area.color}14`,
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 0.75,
                }}
              >
                {/* Color dot maps   */}
                <Box
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    bgcolor: area.color,
                    flexShrink: 0,
                  }}
                />

                <Typography fontSize={13} fontWeight={600} color="text.primary">
                  {area.label}
                </Typography>

                <Typography fontSize={12} color="text.secondary">
                  {area.clickCount} {area.clickCount === 1 ? "click" : "clicks"}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography fontSize={13} color="text.secondary">
              No direct model area clicks recorded for this view.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Explanation accordion */}
      <Box>
        <Box
          onClick={() => setIsHelpOpen((prev) => !prev)}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            color: "text.secondary",
            cursor: "pointer",
            transition: "color 0.15s ease",
            "&:hover": {
              color: "text.primary",
            },
          }}
        >
          <IconButton
            size="small"
            sx={{
              width: 22,
              height: 22,
              p: 0,
              color: "inherit",
              transform: isHelpOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            <ChevronDown size={15} />
          </IconButton>

          <Typography fontSize={12}>What am I seeing?</Typography>
        </Box>

        <Collapse in={isHelpOpen}>
          <Box sx={{ pt: 1 }}>
            <Typography fontSize={12} color="text.secondary" lineHeight={1.6}>
              Colored regions show the top interacted generic model areas. Each
              color maps to an Area label below the model.Blue dots show
              individual recorded surface click points.
            </Typography>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
