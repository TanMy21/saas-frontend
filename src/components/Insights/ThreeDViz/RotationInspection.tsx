import { Box, Typography } from "@mui/material";

export function RotationInspectionCard({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography fontWeight={700}>Rotation / inspection</Typography>

      <Typography fontSize={14} mt={1}>
        {data.viewedMultipleAnglesRate}% viewed multiple angles
      </Typography>

      <Typography fontSize={14} mt={0.5}>
        {data.fullRotationCompletedRate}% completed broad rotation
      </Typography>

      <Typography fontSize={12} color="text.secondary" mt={1}>
        Avg horizontal coverage: {data.avgManualAzimuthCoverage} zones
      </Typography>
    </Box>
  );
}
