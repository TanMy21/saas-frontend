import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { useElectricTheme } from "../../theme/useElectricTheme";
import { VerificationEmailProps } from "../../utils/types";

const VerificationEmailSent = ({ email }: VerificationEmailProps) => {
  const { primary, secondary, grey, shadows, gradient } = useElectricTheme();
  return (
    <Box
      sx={{
        marginTop: "8%",
        width: "100%",
        maxWidth: 480,
        textAlign: "center",
      }}
    >
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
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              backgroundClip: "text",
              textFillColor: "transparent",
              backgroundImage: gradient.background,
            }}
          >
            Check your email
          </Typography>
        </Box>
        <Typography sx={{ color: grey[700] }}>
          We've sent you a verification link
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
          {/* Email Icon */}
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
                gap: 1,
                background: primary.dark,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <MailOutlineIcon sx={{ color: primary.main, fontSize: "32px" }} />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: secondary.dark }}
              >
                Verification email sent
              </Typography>
              <Box sx={{ color: grey[900], textAlign: "center" }}>
                <Typography>We've sent a verification email to:</Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: secondary.dark,
                    mt: 1,
                  }}
                >
                  {email}
                </Typography>
                <Typography mt={1}>
                  Click the link in the email to verify your account.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Resend Link */}
          <Button fullWidth variant="gradientPrimary">
            Resend verification email
          </Button>

          {/* Back Link */}
          <Button component={Link} to="/login" variant="backLink1">
            <ArrowBackIcon />
            Back to login
          </Button>
        </Box>
      </Paper>

      {/* Footer Note */}
      <Typography
        sx={{
          color: grey[900],
          fontSize: "0.875rem",
          textAlign: "center",
          mt: 3,
        }}
      >
        Make sure to check your spam folder if you don't see the email in your
        inbox
      </Typography>
    </Box>
  );
};

export default VerificationEmailSent;
