import { Box, Skeleton } from "@mui/material";

export const SurveyInsightsSkeleton = () => (
  <Box>
    <Skeleton height={80} width={1200} sx={{ mx: "auto" }} />
    <Skeleton height={120} width={1200} sx={{ mx: "auto" }} />
    <Skeleton height={200} width={1200} sx={{ mx: "auto" }} />
    <Skeleton height={320} width={1200} sx={{ mx: "auto" }} />
    <Skeleton height={400} width={1200} sx={{ mx: "auto" }} />
  </Box>
);
