import { Box, Typography, Button } from "@mui/material";
import { SearchX } from "lucide-react";

import { NoResultsProps } from "../../types/behaviorTypes";

export const NoResults = ({ onClearFilters }: NoResultsProps) => {
  return (
    <Box
      sx={{
        mt: 6,
        p: 6,
        borderRadius: 3,
        textAlign: "center",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <SearchX size={48} style={{ opacity: 0.6 }} />

      <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
        No results found
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        No participants match the selected filters.
      </Typography>

      <Button
        variant="outlined"
        size="small"
        sx={{ mt: 3 }}
        onClick={onClearFilters}
      >
        Clear filters
      </Button>
    </Box>
  );
};
