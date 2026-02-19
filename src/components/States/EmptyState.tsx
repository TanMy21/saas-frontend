import { Box, Typography } from "@mui/material";
import { Inbox } from "lucide-react";

export const EmptyState = () => {
  return (
    <Box
      sx={{
        mt: 6,
        p: 6,
        borderRadius: 3,
        textAlign: "center",
        bgcolor: "background.paper",
        border: "1px dashed",
        borderColor: "divider",
      }}
    >
      <Inbox size={48} style={{ opacity: 0.6 }} />

      <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
        No responses yet
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Responses will appear here once participants start responding to this
        survey
      </Typography>
    </Box>
  );
};
