import { Box, Typography } from "@mui/material";

export function ZoomInspectionCard({ data }: { data: any }) {
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
      <Typography fontWeight={700}>Detail inspection</Typography>

      <Typography fontSize={14} mt={1}>
        {data.deepZoomUsedRate}% used deep zoom
      </Typography>

      <Typography fontSize={12} color="text.secondary" mt={1}>
        Deep zoom like rate: {data.deepZoomLikeRate}%
      </Typography>

      <Typography fontSize={12} color="text.secondary">
        No deep zoom like rate: {data.nonDeepZoomLikeRate}%
      </Typography>
    </Box>
  );
}
