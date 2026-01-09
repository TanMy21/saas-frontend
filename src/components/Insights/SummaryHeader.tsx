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
      <Box
        mt={1.5}
        display="flex"
        flexWrap="wrap"
        gap={3}
        alignItems="center"
        justifyContent={"center"}
      >
        <Meta label="Survey" value={title} />
        <Meta label="Responses" value={totalResponses.toLocaleString()} />
        <Meta label="Completion rate" value={`${completionRate}%`} />
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
