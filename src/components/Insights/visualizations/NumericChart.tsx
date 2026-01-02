import { Box, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";

import { formatChartValue } from "../../../utils/utils";

interface Distribution {
  range: string;
  count: number;
}

interface NumericChartProps {
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  distribution: Distribution[];
  displayMode: "count" | "percentage";
}

/* ───────────── Fixed color palette (max 10 bins) ───────────── */

const BAR_COLORS = [
  "#1976D2", // blue (primary)
  "#2E7D32", // green
  "#ED6C02", // orange
  "#0288D1", // cyan
  "#D32F2F", // red
  "#9C27B0", // purple
  "#7C3AED", // violet
  "#059669", // emerald
  "#DC2626", // strong red
  "#0284C7", // sky blue
];


export function NumericChart({
  mean,
  median,
  min,
  max,
  stdDev,
  distribution,
  displayMode,
}: NumericChartProps) {
  const total = distribution.reduce((sum, d) => sum + d.count, 0);

  const chartData = distribution.map((d) => ({
    range: d.range,
    count: d.count,
    percentage: total > 0 ? (d.count / total) * 100 : 0,
  }));

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* ───────────────── Stats grid ───────────────── */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(2, 1fr)",
          sm: "repeat(5, 1fr)",
        }}
        gap={2}
      >
        <Stat label="Mean" value={mean.toFixed(1)} />
        <Stat label="Median" value={median} />
        <Stat label="Min" value={min} />
        <Stat label="Max" value={max} />
        <Stat label="Std Dev" value={stdDev.toFixed(1)} />
      </Box>

      {/* ───────────────── Distribution chart ───────────────── */}
      <Box height={192}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "var(--mui-palette-text-secondary)",
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "var(--mui-palette-text-secondary)",
              }}
              tickFormatter={(value) =>
                typeof value === "number"
                  ? displayMode === "percentage"
                    ? `${value.toFixed(0)}%`
                    : value.toLocaleString()
                  : value
              }
            />

            <Bar
              dataKey={displayMode === "percentage" ? "percentage" : "count"}
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>

            <Tooltip
              cursor={{ fill: "transparent" }}
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
  );
}

/* ───────────────── Helper ───────────────── */

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        bgcolor: "action.hover",
        p: 1.5,
      }}
    >
      <Typography fontSize={12} color="text.secondary">
        {label}
      </Typography>
      <Typography fontSize={18} fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
