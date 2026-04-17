import { Box, IconButton, Typography } from "@mui/material";
import { TriangleAlert, X } from "lucide-react";

import { DangerModalHeaderProps } from "../../types/modalTypes";

export const DangerModalHeader = ({
  title,
  onClose,
}: DangerModalHeaderProps) => (
  <Box
    sx={{
      px: 2,
      pt: 4,
      pb: 2,
      borderBottom: "1px solid #f3f4f6",
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            bgcolor: "#fee2e2",
            color: "red",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TriangleAlert size={28} />
        </Box>

        <Typography
          sx={{ fontSize: 24, fontWeight: 600, color: "#111827", mt: 1 }}
        >
          {title}
        </Typography>
      </Box>

      <IconButton
        onClick={onClose}
        sx={{
          p: 1,
          color: "grey.400",
          "&:hover": {
            color: "grey.600",
            bgcolor: "grey.100",
          },
          borderRadius: 2,
        }}
      >
        <X style={{ width: 28, height: 28 }} />
      </IconButton>
    </Box>
  </Box>
);
