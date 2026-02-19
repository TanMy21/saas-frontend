import { Box, Skeleton } from "@mui/material";

const PariticpantBehaviorLoader = () => {
  return (
    <Box sx={{ px: 3, py: 4 }}>
      {/* Header */}
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />

      {/* Status & Progress */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Skeleton variant="rectangular" width={100} height={32} />
        <Skeleton variant="rectangular" width={100} height={32} />
      </Box>

      {/* Metrics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        <Skeleton variant="rectangular" height={80} />
        <Skeleton variant="rectangular" height={80} />
        <Skeleton variant="rectangular" height={80} />
      </Box>

      {/* Timeline mock */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={40} />
        ))}
      </Box>
    </Box>
  );
};

export default PariticpantBehaviorLoader;
