import { useState } from "react";

import { Box, Typography, Button } from "@mui/material";
import { SignalIcon } from "lucide-react";

import { BehavioralSignals, SegmentComparison } from "../../utils/insightTypes";

import { BehaviorSignalMetricCard } from "./BehaviorSignalMetricCard";
import { SegmentToggle } from "./SegmentToggle";

interface BehavioralSignalsProps {
  signals: BehavioralSignals;
  comparisons?: SegmentComparison[];
  className?: string;
}

export function BehavioralSignal({
  signals,
  comparisons,
  className,
}: BehavioralSignalsProps) {
  const [viewMode, setViewMode] = useState<"overall" | "compare">("overall");

  const completedSignals = comparisons?.find(
    (c) => c.segment === "completed"
  )?.signals;

  const droppedSignals = comparisons?.find(
    (c) => c.segment === "dropped"
  )?.signals;

  /**
   * Renders either:
   * - Compare-mode custom metric card
   * - Overall-mode MetricCard
   *
   * Logic untouched — only UI rewritten
   */
  const renderMetric = (
    label: string,
    value: number,
    unit: string,
    tooltip: string,
    iconType:
      | "hesitation"
      | "duration"
      | "backtrack"
      | "focus"
      | "idle"
      | "interaction",
    comparedCompleted?: number,
    comparedDropped?: number
  ) => {
    if (
      viewMode === "compare" &&
      comparedCompleted !== undefined &&
      comparedDropped !== undefined
    ) {
      return (
        // Compare-mode container
        <Box
          sx={{
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            p: 2,
            animation: "fadeIn 0.2s ease-in",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <SignalIcon type={iconType} size="sm" />
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              {label}
            </Typography>
          </Box>

          {/* Completed */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Completed
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  height: 6,
                  width: 80,
                  bgcolor: "success.light",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    bgcolor: "success.main",
                    width: `${Math.min(comparedCompleted * 10, 100)}%`,
                    transition: "width 0.5s ease",
                    borderRadius: 999,
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  minWidth: 48,
                  textAlign: "right",
                }}
              >
                {comparedCompleted}
                {unit}
              </Typography>
            </Box>
          </Box>

          {/* Dropped */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Dropped
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  height: 6,
                  width: 80,
                  bgcolor: "warning.light",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    bgcolor: "warning.main",
                    width: `${Math.min(comparedDropped * 10, 100)}%`,
                    transition: "width 0.5s ease",
                    borderRadius: 999,
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  minWidth: 48,
                  textAlign: "right",
                }}
              >
                {comparedDropped}
                {unit}
              </Typography>
            </Box>
          </Box>
        </Box>
      );
    }

    // Overall mode → MetricCard unchanged
    return (
      <BehaviorSignalMetricCard
        label={label}
        value={value}
        unit={unit}
        tooltip={tooltip}
        icon={<SignalIcon type={iconType} size="sm" />}
        variant="signal"
        className="animate-fade-in"
      />
    );
  };

  return (
    // Root wrapper (replaces cn + space-y-4)
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Behavioral Signals
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            How respondents interacted with this question
          </Typography>
        </Box>

        {/* Segment toggle */}
        {comparisons && comparisons.length > 0 && (
          <SegmentToggle
            options={[
              { value: "overall", label: "Overall" },
              { value: "compare", label: "Compare Segments" },
            ]}
            value={viewMode}
            onChange={(v) => setViewMode(v as "overall" | "compare")}
          />
        )}
      </Box>

      {/* Metrics grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1.5,
        }}
      >
        {renderMetric(
          "Avg. Hesitation",
          signals.avgHesitationTime,
          "s",
          "Measures how long respondents paused before interacting with this question. Higher values may indicate confusion or difficulty.",
          "hesitation",
          completedSignals?.avgHesitationTime,
          droppedSignals?.avgHesitationTime
        )}

        {renderMetric(
          "Hesitated",
          signals.hesitationPercentage,
          "%",
          "Percentage of respondents who paused longer than the typical threshold before their first interaction.",
          "duration",
          completedSignals?.hesitationPercentage,
          droppedSignals?.hesitationPercentage
        )}

        {renderMetric(
          "Backtracked",
          signals.backtrackPercentage,
          "%",
          "Percentage of respondents who went back to previous questions while on this question.",
          "backtrack",
          completedSignals?.backtrackPercentage,
          droppedSignals?.backtrackPercentage
        )}

        {renderMetric(
          "Lost Focus",
          signals.focusLossPercentage,
          "%",
          "Percentage of respondents who switched away from the survey tab while on this question.",
          "focus",
          completedSignals?.focusLossPercentage,
          droppedSignals?.focusLossPercentage
        )}

        {renderMetric(
          "Went Idle",
          signals.idlePercentage,
          "%",
          "Percentage of respondents who were inactive for an extended period before answering.",
          "idle",
          completedSignals?.idlePercentage,
          droppedSignals?.idlePercentage
        )}

        {renderMetric(
          "Avg. Duration",
          signals.avgInteractionDuration,
          "s",
          "Average time spent interacting with this question from first view to answer submission.",
          "interaction",
          completedSignals?.avgInteractionDuration,
          droppedSignals?.avgInteractionDuration
        )}
      </Box>

      {/* Reset comparison */}
      {viewMode === "compare" && (
        <Button
          variant="text"
          size="small"
          onClick={() => setViewMode("overall")}
          sx={{
            alignSelf: "flex-start",
            color: "text.secondary",
            textTransform: "none",
            "&:hover": {
              color: "text.primary",
            },
          }}
        >
          ← Reset comparison
        </Button>
      )}
    </Box>
  );
}
