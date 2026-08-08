import { ReactNode, useCallback, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";

import { SurveyEditLockConfirmContext } from "../hooks/useEditLockConfirm";
import { ConfirmOptions, ConfirmRequest } from "../types/surveyBuilderTypes";

export const EditLockConfirmProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setRequest({ ...options, resolve });
    });
  }, []);

  const handleCancel = () => {
    request?.resolve(false);
    setRequest(null);
  };

  const handleConfirm = () => {
    request?.resolve(true);
    setRequest(null);
  };

  return (
    <SurveyEditLockConfirmContext.Provider value={confirm}>
      {children}

      <Dialog open={!!request} onClose={handleCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="div"
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              bgcolor: "#FEF3C7",
              color: "#B45309",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={20} />
          </Box>

          {request?.title ?? "Continue with this change ?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "grey.700" }}>
            {request?.message}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancel}
            sx={{
              px: 3,
              py: 0.8,
              color: "#334155",
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: "transparent",
              transition: "background 0.15s",
              "&:hover": {
                bgcolor: "#e2e8f0",
                color: "#0f172a",
              },
            }}
          >
            {request?.cancelText ?? "Cancel"}
          </Button>

          <Button
            onClick={handleConfirm}
            sx={{
              px: 4,
              py: 0.8,
              bgcolor: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#1d4ed8",
              },
              minWidth: 80,
            }}
          >
            {request?.confirmText ?? "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </SurveyEditLockConfirmContext.Provider>
  );
};
