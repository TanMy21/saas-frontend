import { Box, Typography } from "@mui/material";

export function PerformanceWarningCard({ data }: { data: any }) {
  if (!data?.hasWarning) return null;

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "warning.light",
        borderRadius: 2,
        bgcolor: "rgba(245, 158, 11, 0.08)",
      }}
    >
      <Typography fontWeight={700}>Performance note</Typography>

      {data.warnings.map((warning: string, index: number) => (
        <Typography key={index} fontSize={13} color="text.secondary" mt={1}>
          {warning}
        </Typography>
      ))}
    </Box>
  );
}
