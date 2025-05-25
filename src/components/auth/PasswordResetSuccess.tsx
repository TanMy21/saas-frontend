import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button, Paper, Typography } from "@mui/material";
import { ArrowLeftIcon } from "@mui/x-date-pickers";
import { Link } from "react-router-dom";

import { useElectricTheme } from "../../theme/useElectricTheme";
import { PasswordResetSuccessProps } from "../../utils/types";

const PasswordResetSuccess = ({
  submittedEmail,
  reset,
}: PasswordResetSuccessProps) => {
  const { primary, background, grey, textStyles, shadows } = useElectricTheme();
  return (
    <Box
      sx={{
        minHeight: "60%",
        bgcolor: background.soft1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <Typography sx={textStyles.gradientPrimary}>
              Check your email
            </Typography>
          </Box>
        </Box>

        {/* Main Card */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: shadows[9],
            textAlign: "center",
          }}
        >
          {/* Email Icon */}
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                background: background.soft1,
                color: primary.main,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MailOutlineIcon
                style={{ color: primary.main, fontSize: "32px" }}
              />
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ mb: 5 }}>
            <Typography sx={textStyles.strongH6}>
              Verification email sent
            </Typography>
            <Box sx={{ mt: 1, color: grey[920] }}>
              <Typography>We've sent a verification email to:</Typography>
              <Typography sx={textStyles.strongH6}>{submittedEmail}</Typography>
              <Typography>
                Click the link in the email to verify your account.
              </Typography>
            </Box>
          </Box>
          {/* Resend Button */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: primary.main,
              }}
            >
              Didn't receive the email?
              <Button onClick={() => reset()} variant="textLink1">
                Click to resend
              </Button>
            </Typography>
          </Box>

          {/* Back to Login */}
          <Link
            to="/login"
            style={{ textDecoration: "none", color: primary.main }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                color: primary.dark,
                fontWeight: "medium",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <ArrowLeftIcon />
              Back to login
            </Box>
          </Link>
        </Paper>

        {/* Footer Note */}
        <Typography
          sx={{
            color: grey[955],
            fontSize: "0.875rem",
            textAlign: "center",
            mt: 3,
          }}
        >
          Make sure to check your spam folder if you don't see the email in your
          inbox.
        </Typography>
      </Box>
    </Box>
  );
};

export default PasswordResetSuccess;
