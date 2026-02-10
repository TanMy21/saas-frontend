import { Box, Typography } from "@mui/material";

export const Stat = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        bgcolor: "action.hover",
        p: 1.5,
      }}
    >
      <Typography fontSize={12} color="text.secondary">
        {label}
      </Typography>
      <Typography fontSize={18} fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
