import { useState } from "react";

import { Box, ButtonBase } from "@mui/material";

import {
  ThreeDBehaviorDetailsTabsProps,
  ThreeDInsightTab,
} from "../../../types/behaviorTypes";

import { ThreeDBehaviorByAnswer } from "./ThreeDBehaviorByAnswer";
import { ThreeDModelAreaSummary } from "./ThreeDModelAreaSummary";
import { ThreeDScreenZoneHeatmap } from "./ThreeDScreenZoneHeatmap";

const THREE_D_TABS: { value: ThreeDInsightTab; label: string }[] = [
  { value: "by-answer", label: "Verdict" },
  { value: "viewport", label: "Focus" },
  { value: "regions", label: "Regions" },
];

export function ThreeDBehaviorDetailsTabs({
  data,
  activeAreas,
}: ThreeDBehaviorDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<ThreeDInsightTab>("by-answer");

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: 36,
          borderRadius: 2,
          bgcolor: "#f2f3f5",
          p: 0.25,
          pl: 0.5,
          pr: 0.5,
          gap: 0.5,
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        {THREE_D_TABS.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <ButtonBase
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              sx={{
                height: "84%",
                px: 1.5,
                borderRadius: 1.5,
                whiteSpace: "nowrap",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1,
                color: isActive ? "text.primary" : "text.secondary",
                bgcolor: isActive ? "background.paper" : "transparent",
                boxShadow: isActive
                  ? "0 1px 3px rgba(15, 23, 42, 0.12)"
                  : "none",
                transition: "all 0.18s ease",
                cursor: "pointer",

                "&:hover": {
                  bgcolor: isActive
                    ? "background.paper"
                    : "rgba(255,255,255,0.55)",
                  color: "text.primary",
                },

                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: 2,
                },
              }}
            >
              {tab.label}
            </ButtonBase>
          );
        })}
      </Box>

      {/* Tab content */}
      <Box sx={{ pt: 3 }}>
        {activeTab === "by-answer" && <ThreeDBehaviorByAnswer data={data} />}

        {activeTab === "viewport" && (
          <ThreeDScreenZoneHeatmap
            summary={data.heatmap?.screenZoneClickSummary ?? {}}
          />
        )}

        {activeTab === "regions" && (
          <ThreeDModelAreaSummary areas={activeAreas} />
        )}
      </Box>
    </Box>
  );
}
