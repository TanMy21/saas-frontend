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

import { OPTION_COLORS, ROW_HEIGHT } from "../../../utils/constants";
import { MultipleChoiceChartProps } from "../../../utils/insightTypes";

import { MultipleChoiceTooltip } from "./MultipleChoiceTooltip";

export const MultipleChoiceChart = ({ question }: MultipleChoiceChartProps) => {
  const data = question.result.options.map((opt, index) => ({
    label: opt.label,
    count: opt.count,
    percentage: opt.percentage,
    display: `${opt.count.toLocaleString()} (${Math.round(opt.percentage)}%)`,
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
          gridTemplateColumns: "32% 68%",
          columnGap: "2%",
          width: "100%",
        }}
      >
        {/* Labels */}
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

        {/* Bars */}
        <Box sx={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 80, left: 0, bottom: 4 }}
              style={{ overflow: "visible" }}
            >
              <XAxis type="number" hide domain={[0, 100]} />

              <YAxis type="category" dataKey="label" hide />

              <Bar
                dataKey={"count"}
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
                  dataKey={"display"}
                  position="right"
                  offset={8}
                  formatter={(value) => value}
                  style={{
                    fill: "var(--mui-palette-text-secondary)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                />
              </Bar>

              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={<MultipleChoiceTooltip />}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}
