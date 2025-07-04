import { Alert, Snackbar } from "@mui/material";

import { SnackbarAlertProps } from "../utils/types";

const SnackbarAlert = ({
  openSnackbar,
  handleCloseSnackbar,
}: SnackbarAlertProps) => {
  return (
    <div>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        sx={{ zIndex: 2000 }}
      >
        <Alert
          variant="filled"
          severity="success"
          color="info"
          onClose={handleCloseSnackbar}
          sx={{ fontSize: "16px", fontWeight: "bold" }}
        >
          Link copied to clipboard.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnackbarAlert;
