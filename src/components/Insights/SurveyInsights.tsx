import { useState, useMemo } from "react";

import { Box, Button, Typography } from "@mui/material";
import {
  CheckCircle2,
  Users,
  ArrowDownRight,
  Calendar,
  Smartphone,
} from "lucide-react";

import { calculateDropOff, TREND_DATA } from "../../utils/utils";

import { DetailDrawer } from "./DetailDrawer";
import { InsightsFilterDropdown } from "./InsightsFilterDropdown";
import { SummaryCard } from "./SummaryCard";
import { SurveyInsightsHeader } from "./SurveyInsightsHeader";
import SurveyInsightsTable from "./SurveyInsightsTable";
import { SurveyTrendsChart } from "./SurveyTrendsChart";

/* ------------------------------------
   MOCK DATA
------------------------------------ */

const MOCK_METRICS = {
  started: 1240,
  completed: 890,
  avgTime: "3m 12s",
};

const MOCK_QUESTIONS = [
  {
    id: 1,
    number: "Q1",
    text: "What best describes your role?",
    type: "Multiple Choice",
    reached: 1240,
    answered: 1215,
    distribution: [
      { label: "Founder", percent: 45 },
      { label: "Product Manager", percent: 30 },
      { label: "Engineer", percent: 15 },
      { label: "Other", percent: 10 },
    ],
  },
  {
    id: 2,
    number: "Q2",
    text: "How large is your company?",
    type: "Multiple Choice",
    reached: 1215,
    answered: 1180,
    distribution: [
      { label: "1-10", percent: 60 },
      { label: "11-50", percent: 25 },
      { label: "50+", percent: 15 },
    ],
  },
  {
    id: 3,
    number: "Q3",
    text: "Which features are you most interested in?",
    type: "Checkbox",
    reached: 1180,
    answered: 1120,
    distribution: [
      { label: "Analytics", percent: 80 },
      { label: "Export", percent: 50 },
      { label: "Integration", percent: 30 },
    ],
  },
  {
    id: 4,
    number: "Q4",
    text: "What is your monthly budget for tools?",
    type: "Currency Input",
    reached: 1120,
    answered: 761,
    distribution: [
      { label: "< $50", percent: 20 },
      { label: "$50 - $200", percent: 40 },
      { label: "$200+", percent: 40 },
    ],
  },
  {
    id: 5,
    number: "Q5",
    text: "How did you hear about us?",
    type: "Open Text",
    reached: 761,
    answered: 740,
    distribution: [
      { label: "Answered", percent: 98 },
      { label: "Skipped", percent: 2 },
    ],
  },
];

/* ------------------------------------
   MAIN PAGE COMPONENT
------------------------------------ */

export const SurveyInsights = () => {
  const [selected, setSelected] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ time: "all", device: "all" });
  const [metric, setMetric] = useState("starts");
  const [page, setPage] = useState(1);

  const metrics = useMemo(() => {
    const completionRate = Math.round(
      (MOCK_METRICS.completed / MOCK_METRICS.started) * 100
    );
    return {
      starts: MOCK_METRICS.started,
      completionRate,
      dropOffRate: 100 - completionRate,
    };
  }, []);

  const biggestDrop = useMemo(() => {
    return [...MOCK_QUESTIONS].sort(
      (a, b) =>
        calculateDropOff(b.reached, b.answered).rate -
        calculateDropOff(a.reached, a.answered).rate
    )[0];
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb", p: { xs: 2, sm: 4 } }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <SurveyInsightsHeader
          isLoading={isLoading}
          onRefresh={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1500);
          }}
        />

        <Box
          sx={{
            backgroundColor: "#ffffff", // bg-white
            borderTop: "1px solid #e5e7eb", // border-y border-gray-200
            borderBottom: "1px solid #e5e7eb",
            px: 3, // px-6 (6 * 4px = 24px)
            py: 2, // py-4 (4 * 4px = 16px)
            mb: 4, // mb-8 (8 * 4px = 32px)
            display: "flex", // flex
            gap: 2, // gap-4 (4 * 4px = 16px)
          }}
        >
          <InsightsFilterDropdown
            label="Time Range"
            value={filters.time}
            onChange={(v: string) => setFilters((f) => ({ ...f, time: v }))}
            options={[
              { value: "all", label: "All time" },
              { value: "month", label: "Past month" },
            ]}
            icon={Calendar}
          />

          <InsightsFilterDropdown
            label="Device"
            value={filters.device}
            onChange={(v: string) => setFilters((f) => ({ ...f, device: v }))}
            options={[
              { value: "all", label: "All devices" },
              { value: "mobile", label: "Mobile" },
              { value: "desktop", label: "Desktop" },
            ]}
            icon={Smartphone}
          />
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
            value={metrics.starts}
            icon={Users}
          />
          <SummaryCard
            label="Completion Rate"
            value={`${metrics.completionRate}%`}
            subtext={`${MOCK_METRICS.completed} submissions`}
            icon={CheckCircle2}
          />
          <SummaryCard
            label="Biggest Drop-off"
            value={`${metrics.dropOffRate}%`}
            subtext={biggestDrop.text}
            icon={ArrowDownRight}
            alert
          />
        </Box>

        <Box
          sx={{
            backgroundColor: "#ffffff", // bg-white
            border: "1px solid #e5e7eb", // border border-gray-200
            borderRadius: 3, // rounded-xl
            p: 3, // p-6
            mb: 6, // mb-12
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2, // mb-4
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700, // font-bold
                color: "#111827", // text-gray-900
                fontSize: "1rem",
              }}
            >
              Performance Trends
            </Typography>

            {/* Metric Toggle */}
            <Box
              sx={{
                display: "flex",
                backgroundColor: "#f3f4f6", // bg-gray-100
                borderRadius: 2, // rounded-lg
                p: 0.5, // p-1
              }}
            >
              {["starts", "completionRate", "dropOffRate"].map((m) => {
                const isActive = metric === m;

                return (
                  <Button
                    key={m}
                    onClick={() => setMetric(m)}
                    disableRipple
                    sx={{
                      px: 1.5, // px-3
                      py: 0.75, // py-1.5
                      minWidth: "auto",
                      fontSize: 12, // text-xs
                      fontWeight: 500,
                      textTransform: "none",
                      borderRadius: 1.5, // rounded-md
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
            data={TREND_DATA}
            metric={metric}
            color={
              metric === "starts"
                ? "#6366f1"
                : metric === "completionRate"
                  ? "#10b981"
                  : "#f43f5e"
            }
          />
        </Box>

        <Box>
          <SurveyInsightsTable
            questions={MOCK_QUESTIONS}
            onSelect={setSelected}
          />
        </Box>
      </Box>

      <DetailDrawer
        open={Boolean(selected)}
        question={selected}
        totalStarts={MOCK_METRICS.started}
        onClose={() => setSelected(null)}
      />
    </Box>
  );
};
