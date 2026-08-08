import { Box, Skeleton } from "@mui/material";

export const SkeletonRows = () => {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <Box component="div"
          key={i}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 2,
            gap: 2,
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Box component="div" sx={{ flex: 1 }}>
            <Skeleton width="40%" />
            <Skeleton width="60%" />
          </Box>
        </Box>
      ))}
    </>
  );
};
