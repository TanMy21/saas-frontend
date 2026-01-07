import { Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export const SurveyTrendsChart = ({ data, metric, color }: any) => {
  if (!data || data.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        No trend data available yet.
      </Typography>
    );
  }

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 16, right: 16, bottom: 8, left: 0 }}
        >
          <CartesianGrid
            stroke="#E5E7EB"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            type="category"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
          />

          <YAxis hide domain={[0, 100]} />

          <Tooltip
            formatter={(value?: number) => {
              if (value == null) return "";
              return metric === "starts" ? value : `${value}%`;
            }}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              fontSize: 12,
            }}
          />

          <Line
            type="monotone"
            dataKey={metric}
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
