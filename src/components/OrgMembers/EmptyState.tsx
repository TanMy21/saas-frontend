import { Box, Typography } from "@mui/material";

export const EmptyState = () => {
  return (
    <Box
      sx={{
        py: 10,
        textAlign: "center",
      }}
    >
      <Typography fontWeight={600}>No members yet</Typography>
      <Typography fontSize={13} color="text.secondary">
        Invite your team to collaborate
      </Typography>
    </Box>
  );
};
