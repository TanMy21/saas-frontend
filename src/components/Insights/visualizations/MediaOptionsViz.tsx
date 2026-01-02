import { Box, Typography } from '@mui/material';

interface MediaOption {
  id: number;
  label: string;
  imageUrl: string;
  count: number;
}

interface MediaOptionsProps {
  options: MediaOption[];
  displayMode: 'count' | 'percentage';
}

export function MediaOptionsViz({
  options,
  displayMode,
}: MediaOptionsProps) {
  const total = options.reduce((sum, opt) => sum + opt.count, 0);

  const formatValue = (count: number) => {
    if (displayMode === 'percentage') {
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return `${percentage.toFixed(1)}%`;
    }
    return count.toLocaleString();
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(4, 1fr)',
      }}
      gap={2}
    >
      {options.map((option) => {
        const percentage =
          total > 0 ? (option.count / total) * 100 : 0;

        return (
          <Box
            key={option.id}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'action.hover',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: 3,
              },
              '&:hover img': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {/* Image */}
            <Box
              sx={{
                aspectRatio: '3 / 2',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={option.imageUrl}
                alt={option.label}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
              />
            </Box>

            {/* Gradient overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)',
              }}
            />

            {/* Label + value */}
            <Box
              sx={{
                position: 'absolute',
                insetX: 0,
                bottom: 0,
                p: 1.5,
              }}
            >
              <Typography
                fontSize={14}
                fontWeight={500}
                color="common.white"
              >
                {option.label}
              </Typography>
              <Typography
                fontSize={18}
                fontWeight={700}
                color="common.white"
              >
                {formatValue(option.count)}
              </Typography>
            </Box>

            {/* Percentage badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                borderRadius: 999,
                bgcolor: 'background.paper',
                px: 1,
                py: '2px',
              }}
            >
              <Typography
                fontSize={12}
                fontWeight={500}
                color="text.primary"
              >
                {percentage.toFixed(0)}%
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
