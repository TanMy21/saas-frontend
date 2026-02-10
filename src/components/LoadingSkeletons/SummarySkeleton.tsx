import { Box, Skeleton } from "@mui/material";

export const SummarySkeleton = () => (
  <Box
    p={3}
    borderRadius={2}
    border="1px solid"
    borderColor="divider"
  >
    <Skeleton width="40%" height={24} />
    <Skeleton height={80} sx={{ mt: 2 }} />
  </Box>
);
