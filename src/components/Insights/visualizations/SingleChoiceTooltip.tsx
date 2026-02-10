import { Box, Typography } from "@mui/material";

export const SingleChoiceTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const count = Number(data.count);
  const pct = Math.round(data.percentage);

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 1,
        px: 1.5,
        py: 1,
        boxShadow: 2,
        fontSize: 12,
      }}
    >
      {/* Option label */}
      <Typography fontSize={12} fontWeight={600} mb={0.5}>
        {label}
      </Typography>

      {/* Count */}
      <Typography fontSize={12} color="text.secondary">
        count: {count.toLocaleString()}
      </Typography>

      {/* Percentage */}
      <Typography fontSize={12} color="text.secondary">
        percentage: {pct}%
      </Typography>
    </Box>
  );
};
