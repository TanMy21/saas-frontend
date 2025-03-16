import { useEffect } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import {
  useGetMeQuery,
  useResendVerificationEmailMutation,
} from "../app/slices/userApiSlice";
import usePersist from "../hooks/persist";
import { ErrorData } from "../utils/types";

const EmailNotVerified = () => {
  const navigate = useNavigate();
  const [persist, setPersist] = usePersist();
  const [resendVerificationEmail, { isLoading, isSuccess, isError, error }] =
    useResendVerificationEmailMutation();

  const [sendLogout, { isSuccess: isSuccessLogout }] = useSendLogoutMutation();

  const { data: user } = useGetMeQuery("User");

  const email = user?.email || "";

  const handleResendCode = async () => {
    try {
      await resendVerificationEmail(email).unwrap();
    } catch (err) {
      console.error("Failed to resend verification code: ", err);
    }
  };

  useEffect(() => {
    if (isSuccessLogout) navigate("/");
  }, [isSuccessLogout, navigate]);

  const onLogoutClicked = () => {
    setPersist(false);
    sendLogout();
    navigate("/");
  };

  useEffect(() => {
    if (isError) {
      const errorData = error as ErrorData;

      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError, error]);

  return (
    <Container component="main" maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isSuccess ? (
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
                    backgroundImage:
                      "linear-gradient(to right, #7C3AED, #EC4899)",
                  }}
                >
                  Check your email
                </Typography>
              </Box>
              <Typography color="#4B5563">
                We've sent you a verification link
              </Typography>
            </Box>

            {/* Main Card */}
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
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
                      background: "#FAF5FF",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <MailOutlineIcon
                      sx={{ color: "#7C3AED", fontSize: "32px" }}
                    />
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
                    <Typography variant="h6" fontWeight="bold" color="#202635">
                      Verification email sent
                    </Typography>
                    <Box sx={{ color: "#4B5563", textAlign: "center" }}>
                      <Typography>
                        We've sent a verification email to:
                      </Typography>
                      <Typography fontWeight="bold" color="#202635" mt={1}>
                        {email}
                      </Typography>
                      <Typography mt={1}>
                        Click the link in the email to verify your account.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Resend Link */}
                <Button
                  fullWidth
                  sx={{
                    py: 1.5,
                    background: "linear-gradient(to right, #7C3AED, #EC4899)",
                    color: "white",
                    borderRadius: 2,
                    fontWeight: "bold",
                    transition: "opacity 0.2s",
                    textTransform: "none",
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  Resend verification email
                </Button>

                {/* Back Link */}
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    color: "#7C3AED",
                    fontWeight: "medium",
                    textTransform: "none",
                    background: "none",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "none", background: "none" },
                  }}
                >
                  <ArrowBackIcon />
                  Back to login
                </Button>
              </Box>
            </Paper>

            {/* Footer Note */}
            <Typography
              sx={{
                color: "#4B5563",
                fontSize: "0.875rem",
                textAlign: "center",
                mt: 3,
              }}
            >
              Make sure to check your spam folder if you don't see the email in
              your inbox
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: "60%",
              marginTop: "8%",
              bgcolor: "#F8F9FF",
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
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      backgroundClip: "text",
                      textFillColor: "transparent",
                      backgroundImage:
                        "linear-gradient(to right, #7C3AED, #EC4899)",
                    }}
                  >
                    Verify your email
                  </Typography>
                </Box>
                <Typography sx={{ color: "#666F7C" }}>
                  Check your inbox to activate your account
                </Typography>
              </Box>

              {/* Main Card */}
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
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
                      bgcolor: "#FEF2F2",
                      borderRadius: 2,
                      color: "#B91A1A",
                      mb: 1,
                    }}
                  >
                    <ErrorOutlineIcon />
                    <Typography fontWeight="bold">
                      Email not verified
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1,
                      fontSize: "1rem",
                      color: "#4E5866",
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
                  <Typography fontWeight="bold" color="gray.900">
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
                            bgcolor: "#7C3AED",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography sx={{ color: "gray.600" }}>
                          {text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Resend Email Button */}
                <Box sx={{ mb: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleResendCode}
                    // disabled={isLoading || isSuccess}
                    sx={{
                      py: 1.5,
                      px: 2,
                      background: "linear-gradient(to right, #7C3AED, #EC4899)",
                      color: "white",
                      borderRadius: 2,
                      fontWeight: "medium",
                      opacity: 1,
                      transition: "opacity 0.2s",
                      "&:hover": { opacity: 0.9 },
                    }}
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
                  color: "#7F8692",
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
                  <Button
                    onClick={onLogoutClicked}
                    sx={{
                      color: "#7C3BED",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      textTransform: "unset",
                      "&:hover": { textDecoration: "none", background: "none" },
                    }}
                  >
                    Sign out
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default EmailNotVerified;
