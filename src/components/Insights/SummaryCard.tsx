import { Box, Card, Typography } from "@mui/material";

export const SummaryCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  alert,
}: any) => (
  <Card
    sx={{
      p: 2,
      height: 112,
      border: "1px solid",
      borderColor: alert ? "#fee2e2" : "divider",
      bgcolor: alert ? "#fff7ed" : "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="caption" fontWeight={700} color="text.secondary">
        {label}
      </Typography>
      {Icon && <Icon size={18} color={alert ? "#dc2626" : "#9ca3af"} />}
    </Box>

    <Box>
      <Typography variant="h6" fontWeight={700}>
        {value}
      </Typography>
      {subtext && (
        <Typography variant="body2" color="text.secondary">
          {subtext}
        </Typography>
      )}
    </Box>
  </Card>
);
