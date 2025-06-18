import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, Paper, Typography } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { VerifyEmailCardProps } from "../../utils/types";

const VerifyEmailCard = ({
  setPersist,
  sendLogout,
  resendVerificationEmail,
  email,
  isLoading,
  isSuccess,
  navigate,
}: VerifyEmailCardProps) => {
  const { primary, background, grey, shadows, text, textStyles } =
    useAppTheme();

  const handleResendCode = async () => {
    try {
      await resendVerificationEmail({ email }).unwrap();
    } catch (err) {
      console.error("Failed to resend verification code: ", err);
    }
  };

  const onLogoutClicked = () => {
    setPersist(false);
    sendLogout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "60%",
        marginTop: "8%",
        bgcolor: background.soft1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 640 }}>
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
              Verify your email
            </Typography>
          </Box>
          <Typography sx={{ color: grey[950] }}>
            Check your inbox to activate your account
          </Typography>
        </Box>

        {/* Main Card */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: shadows[9],
          }}
        >
          {/* Email Status */}
          <Box sx={{ mb: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                p: 2,
                bgcolor: background.softRed,
                borderRadius: 2,
                color: text.danger,
                mb: 1,
              }}
            >
              <ErrorOutlineIcon />
              <Typography fontWeight="bold">Email not verified</Typography>
            </Box>
            <Typography
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                fontSize: "1rem",
                color: grey[910],
              }}
            >
              We've sent a verification link to:
              <Typography component="span" fontWeight="bold">
                {email}
              </Typography>
            </Typography>
          </Box>

          {/* Verification Steps */}
          <Box sx={{ mb: 3, p: 1 }}>
            <Typography sx={{ fontWeight: "bold", color: grey[800] }}>
              Next steps:
            </Typography>
            <Box sx={{ mt: 1 }}>
              {[
                "Check your email inbox for the verification link",
                "Click the link in the email to verify your account",
              ].map((text, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: primary.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography sx={{ color: grey[600] }}>{text}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Resend Email Button */}
          <Box sx={{ mb: 1 }}>
            <Button
              fullWidth
              variant="gradientPrimary"
              onClick={handleResendCode}
            >
              {isLoading ? (
                "Sending..."
              ) : isSuccess ? (
                <>
                  <CheckCircleIcon style={{ marginRight: 8 }} />
                  Email sent successfully
                </>
              ) : (
                <>
                  Resend verification email
                  <ArrowForwardIcon style={{ marginLeft: 8 }} />
                </>
              )}
            </Button>
          </Box>
        </Paper>
        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            textAlign: "center",
            fontSize: "0.875rem",
            color: grey[960],
          }}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Wrong email address?
            <Button onClick={onLogoutClicked} variant="backLink2">
              Sign out
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyEmailCard;
