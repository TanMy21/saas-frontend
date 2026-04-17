import { Box, Modal } from "@mui/material";

import { DangerModalShellProps } from "../../types/modalTypes";

export const DangerModalShell = ({
  open,
  onClose,
  children,
}: DangerModalShellProps) => (
  <Modal open={open} onClose={onClose} disableEnforceFocus>
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        onClick={onClose}
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
        }}
      />

      <Box sx={{ position: "relative", width: "100%", maxWidth: 500 }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: 12,
            border: "1px solid #f3f4f6",
            overflow: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  </Modal>
);
