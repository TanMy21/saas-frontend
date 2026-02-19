import { Box, Typography } from "@mui/material";

import { BehaviorMetricProps } from "../../types/behaviorTypes";

export function Metric({ label, value, sx }: BehaviorMetricProps) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        textAlign: "center",
        fontWeight: 600,
        ...sx,
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        {value}
      </Typography>

      <Typography variant="caption">{label}</Typography>
    </Box>
  );
}
