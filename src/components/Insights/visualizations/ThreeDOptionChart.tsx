import { Box, Typography } from '@mui/material';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

interface ThreeDOptionChartProps {
  like: number;
  dislike: number;
  displayMode: 'count' | 'percentage';
}

export function ThreeDOptionChart({
  like,
  dislike,
  displayMode,
}: ThreeDOptionChartProps) {
  const total = like + dislike;
  const likePercentage = total > 0 ? (like / total) * 100 : 0;
  const dislikePercentage = total > 0 ? (dislike / total) * 100 : 0;

  const formatValue = (count: number, percentage: number) => {
    if (displayMode === 'percentage') {
      return `${percentage.toFixed(1)}%`;
    }
    return count.toLocaleString();
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* ───────────────── Visual split ───────────────── */}
      <Box
        sx={{
          display: 'flex',
          height: 96,
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        {/* Like */}
        <Box
          sx={{
            width: `${likePercentage}%`,
            bgcolor: 'success.main',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            transition: 'width 0.5s ease',
          }}
        >
          {likePercentage > 20 && (
            <>
              <ThumbsUp
                size={24}
                color="var(--mui-palette-success-contrastText)"
              />
              <Typography
                fontSize={14}
                fontWeight={600}
                color="success.contrastText"
              >
                {formatValue(like, likePercentage)}
              </Typography>
            </>
          )}
        </Box>

        {/* Dislike */}
        <Box
          sx={{
            width: `${dislikePercentage}%`,
            bgcolor: 'error.main',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            transition: 'width 0.5s ease',
          }}
        >
          {dislikePercentage > 20 && (
            <>
              <ThumbsDown
                size={24}
                color="var(--mui-palette-error-contrastText)"
              />
              <Typography
                fontSize={14}
                fontWeight={600}
                color="error.contrastText"
              >
                {formatValue(dislike, dislikePercentage)}
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
              bgcolor: 'success.main',
              opacity: 0.1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThumbsUp size={20} color="var(--mui-palette-success-main)" />
          </Box>
          <Box>
            <Typography fontSize={14} color="text.secondary">
              Like
            </Typography>
            <Typography fontSize={18} fontWeight={600}>
              {formatValue(like, likePercentage)}
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
              bgcolor: 'error.main',
              opacity: 0.1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThumbsDown size={20} color="var(--mui-palette-error-main)" />
          </Box>
          <Box>
            <Typography fontSize={14} color="text.secondary">
              Dislike
            </Typography>
            <Typography fontSize={18} fontWeight={600}>
              {formatValue(dislike, dislikePercentage)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
