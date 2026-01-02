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

interface Option {
  label: string;
  avgRank: number;
}

interface RankingChartProps {
  options: Option[];
}

const ROW_HEIGHT = 48;

// Minimum visible bar width (UX fix)
const MIN_BAR_PERCENT = 8;

const BAR_COLOR = "#1976d2"; // primary

const medalColors = [
  "#ed6c02", // gold
  "#9e9e9e", // silver
  "#8d6e63", // bronze
];

export function RankingChart({ options }: RankingChartProps) {
  const sortedOptions = [...options].sort((a, b) => a.avgRank - b.avgRank);

  const maxRank = Math.max(...options.map((o) => o.avgRank));
  const minRank = Math.min(...options.map((o) => o.avgRank));
  const range = maxRank - minRank || 1;

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Typography fontSize={12} color="text.secondary">
        Ranked by average position (1 = highest priority)
      </Typography>

      {/* Scroll container to support up to 10 options */}
      <Box
        sx={{
          maxHeight: ROW_HEIGHT * 6, // show ~6 rows, scroll for more
          overflowY: "auto",
          pr: 1,
        }}
      >
        {sortedOptions.map((option, index) => {
          const rawStrength = 100 - ((option.avgRank - minRank) / range) * 100;

          // Clamp so bar is always visible
          const strength = Math.max(rawStrength, MIN_BAR_PERCENT);

          const data = [{ value: strength }];

          return (
            <Box
              key={option.label}
              sx={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 60px",
                alignItems: "center",
                columnGap: 16,
                height: ROW_HEIGHT,
              }}
            >
              {/* ───── Rank / Medal ───── */}
              <Box display="flex" justifyContent="center">
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

              {/* ───── Label + Bar ───── */}
              <Box>
                {/* Label ABOVE bar */}
                <Typography fontSize={14} fontWeight={500} mb={0.5} noWrap>
                  {option.label}
                </Typography>

                {/* Bar */}
                <Box sx={{ height: 16 }}>
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

              {/* ───── Avg rank ───── */}
              <Typography
                fontSize={14}
                color="text.secondary"
                textAlign="right"
              >
                {option.avgRank.toFixed(1)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
