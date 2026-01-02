import { Box, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

import { formatChartLabelValue, formatChartValue } from "../../../utils/utils";

interface Option {
  label: string;
  count: number;
  percentage: number;
}

interface MultipleChoiceChartProps {
  options: Option[];
  totalResponses: number;
  displayMode: "count" | "percentage";
}

const ROW_HEIGHT = 44;

const OPTION_COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#0288d1",
  "#d32f2f",
  "#9c27b0",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#0284c7",
];

export function MultipleChoiceChart({
  options,
  displayMode,
}: MultipleChoiceChartProps) {
  const data = options.map((opt, index) => ({
    label: opt.label,
    count: opt.count,
    percentage: opt.percentage,
    color: OPTION_COLORS[index % OPTION_COLORS.length],
  }));

  const height = data.length * ROW_HEIGHT;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Helper text */}
      <Typography
        sx={{
          fontSize: 12,
          color: "text.secondary",
          mb: 1.5,
        }}
      >
        Respondents could select multiple options
      </Typography>

      {/* ───────────── Grid layout ───────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "30% 68%",
          columnGap: "2%",
          width: "100%",
        }}
      >
        {/* Labels (30%) */}
        <Box>
          {data.map((item) => (
            <Box
              key={item.label}
              sx={{
                height: ROW_HEIGHT,
                display: "flex",
                alignItems: "center",
                fontSize: 14,
                fontWeight: 500,
                color: "text.primary",
                pr: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.label}
            </Box>
          ))}
        </Box>

        {/* Bars (68%) */}
        <Box sx={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 32, left: 0, bottom: 4 }}
            >
              <XAxis
                type="number"
                hide
                domain={[0, displayMode === "percentage" ? 100 : "dataMax"]}
              />

              <YAxis type="category" dataKey="label" hide />

              <Bar
                dataKey={displayMode === "percentage" ? "percentage" : "count"}
                radius={[6, 6, 6, 6]}
                isAnimationActive
                activeBar={{
                  stroke: "rgba(0,0,0,0.15)",
                  strokeWidth: 1,
                  fillOpacity: 0.85,
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}

                {/* Value after bar */}
                <LabelList
                  dataKey={
                    displayMode === "percentage" ? "percentage" : "count"
                  }
                  position="right"
                  offset={8}
                  formatter={(value) =>
                    formatChartLabelValue(value, displayMode)
                  }
                  style={{
                    fill: "var(--mui-palette-text-secondary)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                />
              </Bar>

              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                formatter={(value) => formatChartValue(value, displayMode)}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}
