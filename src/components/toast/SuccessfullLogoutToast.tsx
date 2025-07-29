import { Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { SuccessfullLogoutToastProps } from "../../utils/types";

const SuccessfullLogoutToast = ({
  showLogoutAlert,
  setShowLogoutAlert,
}: SuccessfullLogoutToastProps) => {
  const navigate = useNavigate();
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setShowLogoutAlert(false);
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 500);
  };
  return (
    <Snackbar
      open={showLogoutAlert}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        variant="filled"
        onClose={handleClose}
        severity="success"
        sx={{ width: "100%", color: "white", fontWeight: "bold" }}
      >
        Successfully logged out.
      </Alert>
    </Snackbar>
  );
};

export default SuccessfullLogoutToast;
