import { Box } from "@mui/material";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

import {
  OPTION_COLORS_SINGLE_CHOICE,
  ROW_HEIGHT_SINGLE_CHOICE,
} from "../../../utils/constants";
import { SingleChoiceChartProps } from "../../../utils/insightTypes";

import { SingleChoiceTooltip } from "./SingleChoiceTooltip";

export const SingleChoiceChart = ({ question }: SingleChoiceChartProps) => {
  const total = question.result.options.reduce(
    (sum, opt) => sum + opt.count,
    0,
  );

  const data = question.result.options
    .slice(0, OPTION_COLORS_SINGLE_CHOICE.length)
    .map((opt, index) => ({
      label: opt.label,
      count: opt.count,
      percentage: total > 0 ? (opt.count / total) * 100 : 0,
      color:
        OPTION_COLORS_SINGLE_CHOICE[index % OPTION_COLORS_SINGLE_CHOICE.length],
    }));

  const height = data.length * ROW_HEIGHT_SINGLE_CHOICE;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "30% 68%",
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
              height: ROW_HEIGHT_SINGLE_CHOICE,
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
            margin={{ top: 4, right: 32, left: 0, bottom: 4 }}
          >
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis type="category" dataKey="label" hide />

            <Bar
              dataKey="percentage"
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

              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                formatter={(value) => {
                  const count = Number(value);
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return `${count.toLocaleString()} (${pct}%)`;
                }}
                style={{
                  fill: "var(--mui-palette-text-secondary)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
            </Bar>

            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              content={<SingleChoiceTooltip />}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
