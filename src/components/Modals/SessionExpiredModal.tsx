import { Modal, Box, Typography, Button } from "@mui/material";

import { SessionExpireModalProps } from "../../utils/types";

export default function SessionExpiredModal({
  open,
  onConfirm,
}: SessionExpireModalProps) {
  return (
    <Modal
      open={open}
      aria-labelledby="session-expired-title"
      aria-describedby="session-expired-desc"
      disableEscapeKeyDown
      disableAutoFocus
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 320,
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <Typography id="session-expired-title" variant="h6" gutterBottom>
          Session Expired
        </Typography>
        <Typography id="session-expired-desc" sx={{ mb: 3 }}>
          Your session has expired. Please login again to continue.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          fullWidth
        >
          Go to Login
        </Button>
      </Box>
    </Modal>
  );
}