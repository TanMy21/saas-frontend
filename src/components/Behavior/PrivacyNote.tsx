import { Box, Typography } from "@mui/material";
import { ShieldIcon } from "lucide-react";

export const PrivacyNote = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        bgcolor: "action.hover",
        border: 1,
        borderColor: "divider",
      }}
    >
      {/* Icon */}
      <ShieldIcon
        style={{
          fontSize: 16,
          color: "text.secondary",
          marginTop: "2px",
          flexShrink: 0,
        }}
      />

      {/* Text Content */}
      <Typography
        variant="caption"
        sx={{
          fontSize: 14,
          color: "text.secondary",
        }}
      >
        <Box
          component="span"
          sx={{
            fontWeight: 500,
            mr: 0.5,
          }}
        >
          Privacy note:
        </Box>
        This view shows aggregated interaction patterns, not a recording. All
        data is anonymized and used only to improve survey design.
      </Typography>
    </Box>
  );
};
