import { Box, Button } from "@mui/material";

import { DangerActionButtonProps } from "../../types/modalTypes";

export const DangerActions = ({
  onClose,
  disabled,
  isLoading,
  loadingText,
  confirmationMatch,
}: DangerActionButtonProps) => (
  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 1 }}>
    <Button
      onClick={onClose}
      variant="outlined"
      sx={{
        px: 2.5,
        py: 1.2,
        fontSize: 14,
        fontWeight: 600,
        color: "#374151",
        bgcolor: "#fff",
        border: "1px solid #d1d5db",
        borderRadius: 2,
        "&:hover": {
          bgcolor: "#f3f4f6",
          borderColor: "#9ca3af",
        },
        boxShadow: "none",
      }}
    >
      Cancel
    </Button>

    <Button
      type="submit"
      disabled={disabled}
      sx={{
        px: 2.5,
        py: 1.2,
        fontSize: 14,
        fontWeight: 600,
        borderRadius: 2,
        color: confirmationMatch ? "#fff" : "#9ca3af",
        bgcolor: confirmationMatch ? "#dc2626" : "#e5e7eb",
        cursor: confirmationMatch ? "pointer" : "not-allowed",
        "&:hover": confirmationMatch ? { bgcolor: "#b91c1c" } : {},
        boxShadow: confirmationMatch ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : "none",
        transition: "all 0.2s",
      }}
    >
      {isLoading ? loadingText : "Yes, Delete it"}
    </Button>
  </Box>
);
