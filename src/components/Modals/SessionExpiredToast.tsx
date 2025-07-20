import { Alert, Snackbar } from "@mui/material";

import { SessionExpireToastProps } from "../../utils/types";

export default function SessionExpiredToast({
  open,
  setOpen,
  handleSessionExpired,
}: SessionExpireToastProps) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
    setTimeout(() => {
      handleSessionExpired();
    }, 1000);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        variant="filled"
        onClose={handleClose}
        severity="error"
        sx={{ width: "100%" }}
      >
        Your session has expired. Please log in again.
      </Alert>
    </Snackbar>
  );
}
