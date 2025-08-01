import { Alert, Snackbar } from "@mui/material";

import { PublishSurveyAlertProps } from "../../utils/types";

const PublishSurveyAlert = ({ open, setOpen }: PublishSurveyAlertProps) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        variant="filled"
        onClose={handleClose}
        severity="error"
        sx={{ width: "100%", fontSize: 16, fontWeight: 600, color: "white" }}
      >
        Please publish the survey to generate a shareable link.
      </Alert>
    </Snackbar>
  );
};

export default PublishSurveyAlert;
