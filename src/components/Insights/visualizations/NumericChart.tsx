import { Box } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";

import { BAR_COLORS } from "../../../utils/constants";
import { NumericChartProps } from "../../../utils/insightTypes";
import { formatChartValue, formatRangeLabel } from "../../../utils/utils";

import { NumericDistributionTooltip } from "./NumericDistributionTooltip";
import { Stat } from "./Stat";

export const NumericChart = ({ question }: NumericChartProps) => {
  const total = question.meta.totalResponses || 0;

  const chartData = question.result.distribution.map((d) => ({
    min: d.min,
    max: d.max,
    count: d.count,
    percentage: total > 0 ? (d.count / total) * 100 : 0,
    // Derived label for X-axis
    label: formatRangeLabel(d.min, d.max),
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
        <Stat label="Mean" value={question.result.mean.toFixed(1)} />
        <Stat label="Median" value={question.result.median} />
        <Stat label="Min" value={question.result.min} />
        <Stat label="Max" value={question.result.max} />
        <Stat label="Std Dev" value={question.result.stdDev.toFixed(1)} />
      </Box>

      {/* ───────────────── Distribution chart ───────────────── */}
      <Box height={192}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
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
                typeof value === "number" ? value.toLocaleString() : value
              }
            />

            <Bar dataKey={"count"} radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>

            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value) => formatChartValue(value, "count")}
              content={<NumericDistributionTooltip />}
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
