import { useState, useMemo } from "react";

import { Box, Button, Typography } from "@mui/material";
import {
  CheckCircle2,
  Users,
  ArrowDownRight,
  Calendar,
  Smartphone,
} from "lucide-react";
import { useParams } from "react-router-dom";

import { useGetInsightsQuery } from "../../app/slices/resultsApiSlice";
import {
  DeviceFilter,
  InsightsFilters,
  TimeFilter,
} from "../../utils/insightTypes";
import { SurveyInsightsSkeleton } from "../LoadingSkeletons/SurveyInsightsSkeleton";

import { InsightsFilterDropdown } from "./InsightsFilterDropdown";
import { SummaryCard } from "./SummaryCard";
import { SurveyInsightsTable } from "./SurveyInsightsTable";
import { SurveyTrendsChart } from "./SurveyTrendsChart";

export const SurveyInsights = () => {
  const { surveyID } = useParams();
  const [filters, setFilters] = useState<InsightsFilters>({
    time: "all",
    device: "all",
  });
  const [metric, setMetric] = useState<
    "starts" | "completionRate" | "dropOffRate"
  >("starts");

  const { data, isLoading } = useGetInsightsQuery({
    surveyID: surveyID!,
    time: filters.time,
    device: filters.device,
  });

  /**
   * Summary card metrics
   */
  const metrics = useMemo(() => {
    if (!data) return null;

    return {
      starts: data.summary.starts,
      completionRate: data.summary.completionRate,
      dropOffRate: data.summary.dropOffRate,
      completed: data.summary.completed,
      biggestDropOff: data.summary.biggestDropOff,
    };
  }, [data]);

  /**
   * drop-off table
   */
  const tableQuestions = useMemo(() => {
    if (!data) return [];

    return data.dropOffTable.map((q: any) => ({
      id: q.questionID,
      number: `Q${q.order}`,
      text: q.text,
      type: q.type,
      reached: q.reached,
      answered: q.answered,
      dropped: q.dropOffCount,
      dropOffRate: q.dropOffRate,
      avgTimeMs: q.avgTimeMs,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          pb: 10,
        }}
      >
        <SurveyInsightsSkeleton />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f9fafb", p: { xs: 2, sm: 3 }, pb: 10 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ py: 1, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* LEFT: Filters */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <InsightsFilterDropdown<TimeFilter>
                label="Time Range"
                value={filters.time}
                onChange={(v) => setFilters((f) => ({ ...f, time: v }))}
                options={[
                  { value: "all", label: "All time" },
                  { value: "month", label: "Past month" },
                  { value: "week", label: "Past week" },
                ]}
                icon={Calendar}
              />

              <InsightsFilterDropdown<DeviceFilter>
                label="Device"
                value={filters.device}
                onChange={(v) => setFilters((f) => ({ ...f, device: v }))}
                options={[
                  { value: "all", label: "All devices" },
                  { value: "mobile", label: "Mobile" },
                  { value: "desktop", label: "Desktop" },
                  { value: "tablet", label: "Tablet" },
                ]}
                icon={Smartphone}
              />
            </Box>

            {/* RIGHT: Active filter context & clear filter*/}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {/* Active filter text */}
              {(filters.time !== "all" || filters.device !== "all") && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                  }}
                >
                  Showing:&nbsp;
                  {filters.time !== "all" && (
                    <strong>
                      {filters.time === "week"
                        ? "Past week"
                        : filters.time === "month"
                          ? "Past month"
                          : "All time"}
                    </strong>
                  )}
                  {filters.time !== "all" && filters.device !== "all" && " · "}
                  {filters.device !== "all" && (
                    <strong>
                      {filters.device.charAt(0).toUpperCase() +
                        filters.device.slice(1)}
                    </strong>
                  )}
                </Typography>
              )}

              {/* Clear filters */}
              {(filters.time !== "all" || filters.device !== "all") && (
                <Button
                  size="small"
                  onClick={() =>
                    setFilters({
                      time: "all",
                      device: "all",
                    })
                  }
                  sx={{
                    fontSize: 12,
                    textTransform: "none",
                    color: "#6b7280",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            mb: 4,
          }}
        >
          <SummaryCard
            label="Total Started"
            value={metrics?.starts}
            icon={Users}
          />
          <SummaryCard
            label="Completion Rate"
            value={`${metrics?.completionRate}%`}
            subtext={`${metrics?.completed} submissions`}
            icon={CheckCircle2}
            success
          />
          <SummaryCard
            label="Biggest Drop-off"
            value={`${metrics?.biggestDropOff.dropOffRate}%`}
            subtext={
              metrics?.biggestDropOff && (
                <>
                  <strong>{`Q${metrics.biggestDropOff.order}. `}</strong>
                  {metrics.biggestDropOff.text}
                </>
              )
            }
            icon={ArrowDownRight}
            alert
          />
        </Box>

        <Box
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            p: 3,
            mb: 6,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: "#111827",
                fontSize: "1rem",
              }}
            >
              Performance Trends
            </Typography>

            {/* Metric Toggle */}
            <Box
              sx={{
                display: "flex",
                backgroundColor: "#f3f4f6",
                borderRadius: 2,
                p: 0.5,
              }}
            >
              {["starts", "completionRate", "dropOffRate"].map((m) => {
                const isActive = metric === m;

                return (
                  <Button
                    key={m}
                    onClick={() => setMetric(m as typeof metric)}
                    disableRipple
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      minWidth: "auto",
                      fontSize: 12,
                      fontWeight: 500,
                      textTransform: "none",
                      borderRadius: 1.5,
                      color: isActive ? "#111827" : "#6b7280",
                      backgroundColor: isActive ? "#ffffff" : "transparent",
                      boxShadow: isActive
                        ? "0 1px 2px rgba(0,0,0,0.06)"
                        : "none",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "#ffffff"
                          : "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    {m === "starts"
                      ? "Starts"
                      : m === "completionRate"
                        ? "Completion"
                        : "Drop-off"}
                  </Button>
                );
              })}
            </Box>
          </Box>

          {/* Chart */}
          <SurveyTrendsChart
            data={data?.trends.series ?? []}
            metric={metric}
            color={
              metric === "starts"
                ? "#6366f1"
                : metric === "completionRate"
                  ? "#10b981"
                  : "#f43f5e"
            }
          />

          {data?.trends.series?.length === 1 && (
            <Typography variant="caption" sx={{ color: "#6b7280", mt: 1 }}>
              Trend will appear as more responses come in.
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 8 }}>
          <SurveyInsightsTable questions={tableQuestions} />
        </Box>
      </Box>
    </Box>
  );
};
