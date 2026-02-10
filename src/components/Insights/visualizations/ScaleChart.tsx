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

import { RATING_COLORS, ROW_HEIGHT_SCALE } from "../../../utils/constants";
import { ScaleChartProps } from "../../../utils/insightTypes";

export const ScaleChart = ({ question }: ScaleChartProps) => {
  const total = question.meta.totalResponses || 0;

  // Highest rating on top
  const data = [...question.result.distribution]
    .sort((a, b) => b.value - a.value)
    .map((d) => ({
      label: `${d.value}`,
      count: d.count,
      percentage: total > 0 ? (d.count / total) * 100 : 0,
      color: RATING_COLORS[(d.value - 1) % RATING_COLORS.length],
    }));

  const height = data.length * ROW_HEIGHT_SCALE;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* ───────────────── Stats summary ───────────────── */}
      <Box display="flex" flexWrap="wrap" gap={3} alignItems="center">
        {/* Stars */}
        <Box display="flex" alignItems="center" gap={1}>
          <Box display="flex">
            {Array.from({ length: question.result.scale }).map((_, i) => (
              <Star
                key={i}
                size={16}
                color={
                  i < Math.round(question.result.mean) ? "#ED6C02" : "#BDBDBD"
                }
                fill={i < Math.round(question.result.mean) ? "#ED6C02" : "none"}
              />
            ))}
          </Box>

          <Typography fontSize={18} fontWeight={600}>
            {question.result.mean.toFixed(2)}
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
              {question.result.median}
            </Typography>
          </Box>

          <Box>
            <Typography component="span" color="text.secondary">
              Std Dev:{" "}
            </Typography>
            <Typography component="span" fontWeight={500}>
              {question.result.stdDev.toFixed(2)}
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
        {/* ───── Rating labels ───── */}
        <Box>
          {data.map((item) => (
            <Box
              key={item.label}
              sx={{
                height: ROW_HEIGHT_SCALE,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <Typography component="span">{item.label}</Typography>
              <Star size={14} color="#ED6C02" fill="#ED6C02" />
            </Box>
          ))}
        </Box>

        {/* ───── Bars ───── */}
        <Box sx={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis type="category" dataKey="label" hide />

              <Bar dataKey={"count"} radius={[6, 6, 6, 6]} isAnimationActive>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>

              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;

                  const d = payload[0].payload;

                  return (
                    <Box
                      sx={{
                        backgroundColor: "background.paper",
                        borderRadius: 1,
                        px: 1.5,
                        py: 1,
                        boxShadow: 2,
                        fontSize: 12,
                      }}
                    >
                      <Typography fontSize={12} fontWeight={600} mb={0.5}>
                        {label} ★
                      </Typography>

                      <Typography fontSize={12} color="text.secondary">
                        count: {d.count.toLocaleString()}
                      </Typography>

                      <Typography fontSize={12} color="text.secondary">
                        percentage: {Math.round(d.percentage)}%
                      </Typography>
                    </Box>
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* ───── Value column ───── */}
        <Box>
          {data.map((item) => (
            <Box
              key={item.label}
              sx={{
                height: ROW_HEIGHT_SCALE,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                fontSize: 12,
                color: "text.secondary",
              }}
            >
              {item.count.toLocaleString()} ({Math.round(item.percentage)}%)
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
