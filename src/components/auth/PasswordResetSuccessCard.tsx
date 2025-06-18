import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { useAppTheme } from "../../theme/useAppTheme";

const PasswordResetSuccessCard = () => {
  const { textStyles, background, grey, shadows, iconStyle } =
    useAppTheme();
  return (
    <Box sx={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography sx={textStyles.strongH4}>Password reset</Typography>
        </Box>
        <Typography sx={{ color: grey[900] }}>
          Your password has been updated successfully
        </Typography>
      </Box>

      {/* Main Card */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: shadows[9],
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Success Message */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                background: background.success,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <TaskAltIcon sx={iconStyle.success} />
            </Box>
            <Typography sx={textStyles.strongH6}>Reset successful</Typography>
            <Typography sx={{ color: grey[900] }}>
              Your password has been reset successfully. You can now log in with
              your new password.
            </Typography>
          </Box>

          {/* Login Button */}
          <Button
            fullWidth
            component={Link}
            to="/login"
            variant="gradientPrimary"
          >
            Continue to login
          </Button>

          {/* Back Link */}
          <Button component={Link} to="/" variant="backLink1">
            <ArrowBackIcon />
            Back to home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PasswordResetSuccessCard;
