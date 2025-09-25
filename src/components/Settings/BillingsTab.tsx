import { Box, Stack, Typography, Chip, Grid, Button } from "@mui/material";

import { useGetMeQuery } from "../../app/slices/userApiSlice";

export default function BillingTab() {
  const { data: user } = useGetMeQuery("User", {
    refetchOnMountOrArgChange: true,
  });

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Subscription
        </Typography>
        <Typography color="text.secondary" sx={{ ml: 0.5 }}>
          Manage your subscription and payment methods
        </Typography>
      </Box>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "rgba(148,163,184,0.35)",
          borderRadius: 3,
          p: 3,
          bgcolor: "rgba(255,255,255,0.6)",
        }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography fontWeight={700}>Current Plan</Typography>
            <Typography color="text.secondary">{user.tier}</Typography>
          </Box>
          <Chip label="Active" color="primary" variant="outlined" />
        </Stack>

        <Grid container spacing={2} sx={{ fontSize: 14 }}>
          <Grid item xs={12} md={6}>
            <Typography color="text.secondary" component="span">
              Plan Type:
            </Typography>
            <Typography component="span" sx={{ fontWeight: 600, ml: 1 }}>
              {user.tier}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="text.secondary" component="span">
              Amount:
            </Typography>
            <Typography component="span" sx={{ fontWeight: 600, ml: 1 }}>
              {user.tier === "FREE" ? "$0.00/month" : "$29.00/month"}
            </Typography>
          </Grid>
        </Grid>

        <Button
          sx={{
            mt: 4,
            px: 2,
            py: 1,
            borderRadius: 2,
            fontWeight: 500,
            color: "#fff",
            backgroundImage: "linear-gradient(to right, #3b82f6, #6366f1)",
            transition: "all 200ms ease",
            "&:hover": {
              boxShadow: "0 8px 16px rgba(59,130,246,0.25)",
              transform: "scale(1.05)",
              backgroundImage: "linear-gradient(to right, #3b82f6, #6366f1)",
            },
          }}
        >
          Upgrade Plan
        </Button>
      </Box>
    </Box>
  );
}
