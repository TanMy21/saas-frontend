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
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 16, bottom: 8 }}>
          <CartesianGrid
            stroke="#E5E7EB"
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: any) =>
              metric === "starts" ? v : `${v.toFixed(1)}%`
            }
          />
          <Line
            type="monotone"
            dataKey={metric}
            stroke={color}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
