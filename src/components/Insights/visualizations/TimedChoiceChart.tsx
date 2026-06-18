import { Box, Chip, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TimedChoiceChartProps } from "../../../types/insightTypes";
import {
  IMAGE_ROW_HEIGHT,
  TEXT_ROW_HEIGHT,
  TIMED_CHOICE_COLORS,
} from "../../../utils/constants";
import { formatMs, formatPercent } from "../../../utils/utils";

const TimedChoiceTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        px: 1.5,
        py: 1,
        boxShadow: 2,
        minWidth: 180,
      }}
    >
      <Typography fontSize={13} fontWeight={700} color="text.primary">
        {item.label}
      </Typography>

      <Typography fontSize={12} color="text.secondary">
        Responses: {item.count}
      </Typography>

      <Typography fontSize={12} color="text.secondary">
        Share: {formatPercent(item.percentage)}
      </Typography>

      <Typography fontSize={12} color="text.secondary">
        Avg time: {formatMs(item.avgResponseTimeMs)}
      </Typography>

      <Typography fontSize={12} color="text.secondary">
        Over time: {item.overTimeCount} (
        {formatPercent(item.overTimePercentage)})
      </Typography>
    </Box>
  );
};

const TimedChoiceChart = ({ question }: TimedChoiceChartProps) => {
  const options = question.result.options ?? [];

  const hasImages = options.some((option) => Boolean(option.image));

  const displayMode =
    question.result.displayMode === "TEXT_IMAGE" || hasImages
      ? "TEXT_IMAGE"
      : "TEXT";

  const isTextImageMode = displayMode === "TEXT_IMAGE";

  const total = options.reduce((sum, option) => sum + option.count, 0);

  const data = options.slice(0, 2).map((option, index) => ({
    optionID: option.optionID,
    label: option.label,
    value: option.value,
    image: option.image,
    count: option.count,
    percentage: total > 0 ? (option.count / total) * 100 : 0,
    avgResponseTimeMs: option.avgResponseTimeMs,
    medianResponseTimeMs: option.medianResponseTimeMs,
    overTimeCount: option.overTimeCount,
    overTimePercentage: option.overTimePercentage,
    color: TIMED_CHOICE_COLORS[index % TIMED_CHOICE_COLORS.length],
  }));

  if (!data.length) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography fontSize={14} color="text.secondary">
          No timed choice responses yet.
        </Typography>
      </Box>
    );
  }

  const rowHeight = isTextImageMode ? IMAGE_ROW_HEIGHT : TEXT_ROW_HEIGHT;
  const height = Math.max(data.length * rowHeight, rowHeight);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        <Chip
          size="small"
          label={`Mode: ${isTextImageMode ? "Text + image" : "Text only"}`}
          sx={{
            fontWeight: 700,
            bgcolor: "#eff6ff",
            color: "#005BC4",
          }}
        />

        <Chip
          size="small"
          label={`Avg time: ${formatMs(question.result.timing?.meanResponseTimeMs)}`}
          sx={{
            fontWeight: 700,
            bgcolor: "#f8fafc",
            color: "#334155",
          }}
        />

        <Chip
          size="small"
          label={`Median: ${formatMs(question.result.timing?.medianResponseTimeMs)}`}
          sx={{
            fontWeight: 700,
            bgcolor: "#f8fafc",
            color: "#334155",
          }}
        />

        <Chip
          size="small"
          label={`Over time: ${question.result.timing?.overTimeCount ?? 0} (${formatPercent(
            question.result.timing?.overTimePercentage,
          )})`}
          sx={{
            fontWeight: 700,
            bgcolor: "#fff7ed",
            color: "#ea580c",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isTextImageMode ? "36% 62%" : "30% 68%",
          columnGap: "2%",
          width: "100%",
        }}
      >
        <Box>
          {data.map((item) => (
            <Box
              key={item.optionID}
              sx={{
                height: rowHeight,
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                pr: 1,
                overflow: "hidden",
              }}
            >
              {isTextImageMode && item.image && (
                <Box
                  component="img"
                  src={item.image}
                  alt={item.label}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1.5,
                    objectFit: "cover",
                    border: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0,
                    bgcolor: "#f8fafc",
                  }}
                />
              )}

              {isTextImageMode && !item.image && (
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1.5,
                    border: "1px dashed",
                    borderColor: "divider",
                    flexShrink: 0,
                    bgcolor: "#f8fafc",
                  }}
                />
              )}

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  fontSize={14}
                  fontWeight={700}
                  color="text.primary"
                  title={item.label}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.label}
                </Typography>

                <Typography
                  fontSize={12}
                  color="text.secondary"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Avg {formatMs(item.avgResponseTimeMs)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 48, left: 0, bottom: 4 }}
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
                {data.map((entry) => (
                  <Cell key={entry.optionID} fill={entry.color} />
                ))}

                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  formatter={(value) => {
                    const count = Number(value);
                    const pct =
                      total > 0 ? Math.round((count / total) * 100) : 0;

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
                content={<TimedChoiceTooltip />}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default TimedChoiceChart;
