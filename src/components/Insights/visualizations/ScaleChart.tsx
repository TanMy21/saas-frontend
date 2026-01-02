import { Box, Typography } from "@mui/material";
import { Star } from "lucide-react";
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
  value: number;
  count: number;
}

interface RatingChartProps {
  distribution: Distribution[];
  mean: number;
  median: number;
  stdDev: number;
  scale: number;
  displayMode: "count" | "percentage";
}

const ROW_HEIGHT = 36;

/* Max 10 rating colors */
const RATING_COLORS = [
  "#1976D2",
  "#2E7D32",
  "#ED6C02",
  "#0288D1",
  "#D32F2F",
  "#9C27B0",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#0284C7",
];

export function ScaleChart({
  distribution,
  mean,
  median,
  stdDev,
  scale,
  displayMode,
}: RatingChartProps) {
  const total = distribution.reduce((sum, d) => sum + d.count, 0);

  // Highest rating on top (10 → 1)
  const data = [...distribution]
    .sort((a, b) => b.value - a.value)
    .map((d, index) => ({
      label: `${d.value}★`,
      count: d.count,
      percentage: total > 0 ? (d.count / total) * 100 : 0,
      color: RATING_COLORS[(d.value - 1) % RATING_COLORS.length],
    }));

  const height = data.length * ROW_HEIGHT;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* ───────────────── Stats summary ───────────────── */}
      <Box display="flex" flexWrap="wrap" gap={3} alignItems="center">
        {/* Stars */}
        <Box display="flex" alignItems="center" gap={1}>
          <Box display="flex">
            {Array.from({ length: scale }).map((_, i) => (
              <Star
                key={i}
                size={16}
                color={i < Math.round(mean) ? "#ED6C02" : "#BDBDBD"}
                fill={i < Math.round(mean) ? "#ED6C02" : "none"}
              />
            ))}
          </Box>

          <Typography fontSize={18} fontWeight={600}>
            {mean.toFixed(2)}
          </Typography>

          <Typography fontSize={14} color="text.secondary">
            average
          </Typography>
        </Box>

        {/* Meta */}
        <Box display="flex" gap={3} fontSize={14}>
          <Box>
            <Typography component="span" color="text.secondary">
              Median:{" "}
            </Typography>
            <Typography component="span" fontWeight={500}>
              {median}
            </Typography>
          </Box>

          <Box>
            <Typography component="span" color="text.secondary">
              Std Dev:{" "}
            </Typography>
            <Typography component="span" fontWeight={500}>
              {stdDev.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ───────────────── Distribution rows ───────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "56px 1fr 64px",
          columnGap: 12,
          width: "100%",
        }}
      >
        {/* ───── Rating labels (1★–10★) ───── */}
        <Box>
          {data.map((item) => (
            <>
              <Box
                key={item.label}
                sx={{
                  height: ROW_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Box>
              <Box display="flex">
                <Star size={16} color={"#ED6C02"} fill={"#ED6C02"} />
              </Box>
            </>
          ))}
        </Box>

        {/* ───── Bars (max width) ───── */}
        <Box sx={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
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
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
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

        {/* ───── Value column (after bar) ───── */}
        <Box>
          {data.map((item) => (
            <Box
              key={item.label}
              sx={{
                height: ROW_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                fontSize: 12,
                color: "text.secondary",
              }}
            >
              {displayMode === "percentage"
                ? `${item.percentage.toFixed(0)}%`
                : item.count.toLocaleString()}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
