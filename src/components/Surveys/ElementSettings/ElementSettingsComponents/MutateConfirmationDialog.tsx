import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";

import { questionTypes } from "../../../../utils/elementsConfig";
import { MutateConfirmationDialogProps } from "../../../../utils/types";

export const MutateConfirmationDialog = ({
  pendingType,
  setPendingType,
  applyType,
}: MutateConfirmationDialogProps) => {
  const label = pendingType
    ? questionTypes.find((q) => q.type === pendingType)?.label
    : "";

  return (
    <Dialog open={!!pendingType} onClose={() => setPendingType(null)}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 1,
        }}
      >
        {/* Warning badge */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#FEF3C7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WarningAmberIcon sx={{ color: "#F59E0B", fontSize: 28 }} />
        </Box>

        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          Change Question Type
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <DialogContentText
          sx={{
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.6,
          }}
        >
          Changing this question to <strong>{label}</strong> will remove all
          existing options. This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={() => setPendingType(null)}
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
          onClick={() => pendingType && applyType(pendingType, true)}
          sx={{
            px: 2.5,
            py: 1.2,
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 2,
            color: "#fff",
            bgcolor: "#dc2626",
            "&:hover": { bgcolor: "#b91c1c" },
          }}
        >
          Change Type
        </Button>
      </DialogActions>
    </Dialog>
  );
};
