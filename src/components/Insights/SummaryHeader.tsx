import { Box, Typography } from "@mui/material";
import { FileText } from "lucide-react";

import { SummaryHeaderProps } from "../../utils/insightTypes";

export function SummaryHeader({
  title,
  totalResponses,
  completionRate,
}: SummaryHeaderProps) {
  return (
    <Box
      component="header"
      borderBottom={1}
      borderColor="divider"
      bgcolor="background.paper"
      px={{ xs: 3, lg: 4 }}
      py={4}
    >
      <Box maxWidth={960} mx="auto">
        <Box display="flex" gap={2}>
          <Box
            width={48}
            height={48}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius={2}
            bgcolor="action.selected"
          >
            <FileText size={24} />
          </Box>

          <Box flex={1}>
            <Typography variant="h5" fontWeight={700}>
              Results
            </Typography>
            <Typography color="text.secondary">
              Explore how respondents answered your survey
            </Typography>
          </Box>
        </Box>

        <Box mt={3} display="flex" flexWrap="wrap" gap={3}>
          <Meta label="Survey" value={title} />
          <Meta label="Responses" value={totalResponses.toLocaleString()} />
          <Meta label="Completion rate" value={`${completionRate}%`} />
        </Box>
      </Box>
    </Box>
  );
}

const Meta = ({ label, value }: { label: string; value: string }) => (
  <Box display="flex" gap={1}>
    <Typography variant="body2" color="text.secondary">
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value}
    </Typography>
  </Box>
);
