import { Alert, Snackbar } from "@mui/material";

import { SessionExpireToastProps } from "../../utils/types";

export default function SessionExpiredToast({
  open,
  setOpen,
  handleCloseComplete,
  severity,
  message,
}: SessionExpireToastProps) {
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;

    setOpen(false);

    setTimeout(() => {
      handleCloseComplete();
    }, 300);
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
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
