import { Box, Typography } from "@mui/material";
import { Medal } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { useAppTheme } from "../../../theme/useAppTheme";
import { RankingChartProps } from "../../../types/insightTypes";
import {
  BAR_COLOR,
  medalColors,
  MIN_BAR_PERCENT,
} from "../../../utils/constants";

export const RankingChart = ({ question }: RankingChartProps) => {
  const { scrollStyles } = useAppTheme();
  // Sort by strongest preference, then least disliked
  const sortedOptions = [...question.options].sort(
    (a, b) => b.firstPlace - a.firstPlace || a.lastPlace - b.lastPlace,
  );

  const maxFirst = Math.max(...question.options.map((o) => o.firstPlace)) || 1;

  // const maxLast = Math.max(...question.options.map((o) => o.lastPlace)) || 0;

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Typography fontSize={14} fontWeight={600} color="text.secondary">
        Ranked by top preference
      </Typography>

      {/* Scroll container */}
      <Box
        sx={{
          pr: 1,
          ...scrollStyles.elementsPanel,
        }}
      >
        {sortedOptions.map((option, index) => {
          // Bar strength from firstPlace
          const strength = Math.max(
            (option.firstPlace / maxFirst) * 100,
            MIN_BAR_PERCENT,
          );

          const data = [{ value: strength }];

          return (
            <Box
              key={option.optionID}
              sx={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 80px",
                alignItems: "flex-start",
                columnGap: 16,
                height: "auto",
                py: 0.75,
                // border: "2px solid red",
              }}
            >
              {/* ───── Rank / Medal ───── */}
              <Box display="flex" justifyContent="center" pt={0.5}>
                {index < 3 ? (
                  <Medal size={20} color={medalColors[index]} />
                ) : (
                  <Typography
                    fontSize={14}
                    fontWeight={500}
                    color="text.secondary"
                  >
                    {index + 1}
                  </Typography>
                )}
              </Box>

              {/* ───── Middle Column ───── */}
              <Box display="flex" flexDirection="column" gap={0.5}>
                {/* Label */}
                <Typography fontSize={16} fontWeight={600} noWrap>
                  {option.label}
                </Typography>

                {/* Meta */}
                <Typography fontSize={12} color="text.secondary">
                  {option.firstPlace} top choice
                  {option.lastPlace > 0 && ` • ${option.lastPlace} least`}
                </Typography>

                {/* //   Insights */}
                {/* {isMostLiked && (
                  <Typography fontSize={11} color="success.main">
                    Most preferred
                  </Typography>
                )}

                {isMostDisliked && (
                  <Typography fontSize={11} color="error.main">
                    Most disliked
                  </Typography>
                )} */}

                {/* Bar */}
                <Box sx={{ height: 16, mt: 0.5 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      layout="vertical"
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <XAxis type="number" hide domain={[0, 100]} />
                      <YAxis type="category" hide />
                      <Bar
                        dataKey="value"
                        radius={[8, 8, 8, 8]}
                        isAnimationActive
                      >
                        <Cell fill={BAR_COLOR} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              {/* ───── Right Column ───── */}
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-start"
                pt={0.5}
              >
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  color="text.secondary"
                  textAlign="right"
                >
                  {option.firstPlace} / {question.meta.totalResponses}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
