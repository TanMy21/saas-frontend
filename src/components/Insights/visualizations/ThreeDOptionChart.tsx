import { Box, Typography } from "@mui/material";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { BinaryChartProps } from "../../../utils/insightTypes";

export const ThreeDOptionChart = ({ question }: BinaryChartProps) => {
  const { meta, result } = question;

  const total = meta.totalResponses;

  const likePercentage = total > 0 ? (result.left.count / total) * 100 : 0;
  const dislikePercentage = total > 0 ? (result.right.count / total) * 100 : 0;

  const formatValue = (count: number, pct: number) =>
    `${count.toLocaleString()} (${pct.toFixed(1)}%)`;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* ───────────────── Visual split ───────────────── */}
      <Box
        sx={{
          display: "flex",
          height: 96,
          overflow: "hidden",
          borderRadius: 9999,
        }}
      >
        {/* Like */}
        <Box
          sx={{
            width: `${likePercentage}%`,
            bgcolor: "success.main",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            transition: "width 0.5s ease",
          }}
        >
          {likePercentage > 20 && (
            <>
              <Box sx={{ color: "success.contrastText" }}>
                <ThumbsUp size={24} />
              </Box>
              <Typography
                fontSize={14}
                fontWeight={600}
                color="success.contrastText"
              >
                {formatValue(result.left.count, likePercentage)}
              </Typography>
            </>
          )}
        </Box>

        {/* Dislike */}
        <Box
          sx={{
            width: `${dislikePercentage}%`,
            bgcolor: "error.main",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            transition: "width 0.5s ease",
          }}
        >
          {dislikePercentage > 20 && (
            <>
              <Box sx={{ color: "error.contrastText" }}>
                <ThumbsDown size={24} />
              </Box>
              <Typography
                fontSize={14}
                fontWeight={600}
                color="error.contrastText"
              >
                {formatValue(result.right.count, dislikePercentage)}
              </Typography>
            </>
          )}
        </Box>
      </Box>

      {/* ───────────────── Legend ───────────────── */}
      <Box display="flex" justifyContent="center" gap={6}>
        {/* Like */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "#22C55E",
              opacity: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ color: "#1A202C", opacity: 1 }}>
              <ThumbsUp size={24} />
            </Box>
          </Box>
          <Box>
            <Typography fontSize={14} color="text.secondary">
              Like
            </Typography>
            <Typography fontSize={18} fontWeight={600}>
              {formatValue(result.left.count, likePercentage)}
            </Typography>
          </Box>
        </Box>

        {/* Dislike */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "#EF4444",
              opacity: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ color: "error.contrastText" }}>
              <ThumbsDown size={24} />
            </Box>
          </Box>
          <Box>
            <Typography fontSize={14} color="text.secondary">
              Dislike
            </Typography>
            <Typography fontSize={18} fontWeight={600}>
              {formatValue(result.right.count, dislikePercentage)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
