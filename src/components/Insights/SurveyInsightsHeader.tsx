import { Box, Button, Typography } from "@mui/material";
import { Download, HelpCircle, RefreshCw } from "lucide-react";

export const SurveyInsightsHeader = ({ isLoading, onRefresh }: any) => (
  <Box
    sx={{
      mb: 4,
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "space-between",
      gap: 2,
    }}
  >
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5" fontWeight={600}>
          Drop-off Analysis
        </Typography>
        <HelpCircle size={16} color="#9ca3af" />
      </Box>
      <Typography variant="body2" color="text.secondary">
        Analyze where participants stop progressing through your survey.
      </Typography>
    </Box>

    <Box sx={{ display: "flex", gap: 1 }}>
      <Button variant="outlined" startIcon={<Download size={16} />}>
        Export
      </Button>
    </Box>
  </Box>
);
