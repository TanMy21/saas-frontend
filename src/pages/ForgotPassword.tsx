import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowLeftIcon } from "@mui/x-date-pickers";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useForgotPasswordMutation } from "../app/slices/authApiSlice";
import FormErrors from "../components/FormErrors";
import { forgetPasswordSchema } from "../utils/schema";
import { ErrorData, ForgotPasswordRequest } from "../utils/types";

const ForgotPassword = () => {
  const [forgotPassword, { isSuccess, isError, error, isLoading, reset }] =
    useForgotPasswordMutation();
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const submitForgotPasswordRequest = async (data: ForgotPasswordRequest) => {
    const { email } = data;
    setSubmittedEmail(email);
    try {
      await forgotPassword(email).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (data: ForgotPasswordRequest) => {
    submitForgotPasswordRequest(data);
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
    <Container component="main" maxWidth="xl" sx={{ marginTop: "8%" }}>
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "92%",
            p: 4,
          }}
        >
          <Box>
            {isSuccess ? (
              <Box
                sx={{
                  minHeight: "60%",
                  bgcolor: "#F8F9FF",
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
                  </Box>

                  {/* Main Card */}
                  <Paper
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                      textAlign: "center",
                    }}
                  >
                    {/* Email Icon */}
                    <Box
                      sx={{ mb: 3, display: "flex", justifyContent: "center" }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          background: "#F8F9FF",
                          color: "#7630EC",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MailOutlineIcon
                          style={{ color: "#7630EC", fontSize: "32px" }}
                        />
                      </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ mb: 5 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="#080F1F"
                      >
                        Verification email sent
                      </Typography>
                      <Box sx={{ mt: 1, color: "#59626F" }}>
                        <Typography>
                          We've sent a verification email to:
                        </Typography>
                        <Typography fontWeight="bold" color="#080F1F">
                          {submittedEmail}
                        </Typography>
                        <Typography>
                          Click the link in the email to verify your account.
                        </Typography>
                      </Box>
                    </Box>
                    {/* Resend Button */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        color={"#7E3DED"}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        Didn't receive the email?
                        <Button
                          onClick={() => reset()}
                          sx={{
                            textTransform: "unset",
                            color: "#7E3DED",
                            fontWeight: "bold",
                            fontSize: "16px",
                            textDecoration: "none",
                            background: "none",
                            "&:hover": {
                              textDecoration: "none",
                              background: "none",
                            },
                          }}
                        >
                          Click to resend
                        </Button>
                      </Typography>
                    </Box>

                    {/* Back to Login */}
                    <Link
                      to="/login"
                      style={{ textDecoration: "none", color: "#6941C6" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          color: "#7C3AED",
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
                      color: "#69707F",
                      fontSize: "0.875rem",
                      textAlign: "center",
                      mt: 3,
                    }}
                  >
                    Make sure to check your spam folder if you don't see the
                    email in your inbox.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  minHeight: "60%",
                  bgcolor: "#F8F9FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 600,
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
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                          backgroundClip: "text",
                          textFillColor: "transparent",
                          backgroundImage:
                            "linear-gradient(to right, #7C3AED, #EC4899)",
                        }}
                      >
                        Reset password
                      </Typography>
                    </Box>
                    <Typography sx={{ color: "#606875" }}>
                      We'll send you instructions via email
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
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                      }}
                    >
                      {/* Email Input */}
                      <Box>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          InputLabelProps={{ style: { color: "gray" } }}
                          {...register("email")}
                          variant="filled"
                          sx={{
                            mb: 2,
                            "& .MuiFilledInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#F8F9FF",
                              borderBottom: "none !important",
                              boxShadow: "none",
                              "&:hover": {
                                backgroundColor: "#F8F9FF",
                              },
                              "&.Mui-focused": {
                                backgroundColor: "#F8F9FF",
                                boxShadow: "none",
                              },
                              "&:before, &:after": {
                                display: "none",
                              },
                            },
                            "& .MuiInputAdornment-root": {
                              backgroundColor: "#F8F9FF",
                              borderRadius: "12px 0 0 12px",
                              paddingLeft: "8px",
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MailOutlineIcon sx={{ color: "gray" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                        {errors.email && (
                          <FormErrors errors={errors.email?.message} />
                        )}
                      </Box>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading || isSuccess}
                        fullWidth
                        sx={{
                          py: 1.5,
                          background:
                            "linear-gradient(to right, #7C3AED, #EC4899)",
                          color: "white",
                          borderRadius: 2,
                          fontWeight: "bold",
                          transition: "opacity 0.2s",
                          textTransform: "unset",
                          "&:hover": { opacity: 0.9 },
                          "&:disabled": { opacity: 0.7 },
                        }}
                      >
                        {isLoading ? (
                          "Sending..."
                        ) : isSuccess ? (
                          <>
                            <CheckCircleIcon style={{ marginRight: 8 }} />
                            Instructions sent
                          </>
                        ) : (
                          <>
                            Send reset instructions
                            <ArrowForwardIcon style={{ marginLeft: 8 }} />
                          </>
                        )}
                      </Button>

                      {/* Back to Sign In */}
                      <Link to="/login" style={{ textDecoration: "none" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            color: "#7C3AED",
                            fontWeight: "medium",
                            "&:hover": { textDecoration: "none" },
                          }}
                        >
                          <ArrowBackIcon />
                          Back to sign in
                        </Box>
                      </Link>
                    </form>
                  </Paper>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
