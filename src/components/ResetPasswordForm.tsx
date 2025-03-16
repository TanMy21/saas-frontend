import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useResetPasswordMutation } from "../app/slices/authApiSlice";
import { resetPasswordSchema } from "../utils/schema";
import {
  ErrorData,
  ResetPassword,
  ResetPasswordFormData,
} from "../utils/types";

import FormErrors from "./FormErrors";

const ResetPasswordForm = ({ code }: ResetPassword) => {
  const [resetPassword, { isSuccess, isError, error }] =
    useResetPasswordMutation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const submitResetPassword = async (data: ResetPasswordFormData) => {
    const { password } = data;
    try {
      await resetPassword({ password, code }).unwrap();
    } catch (error) {
      console.error(error);
    }
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
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "60%",
          borderRadius: "12px",
        }}
      >
        {isSuccess ? (
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
                  Password reset
                </Typography>
              </Box>
              <Typography color="#4B5563">
                Your password has been updated successfully
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
                      background: "#F0FDF4",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <TaskAltIcon sx={{ color: "#22C55E", fontSize: "32px" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="gray.900">
                    Reset successful
                  </Typography>
                  <Typography color="#4B5563" mt={1}>
                    Your password has been reset successfully. You can now log
                    in with your new password.
                  </Typography>
                </Box>

                {/* Login Button */}
                <Button
                  fullWidth
                  component={Link}
                  to="/login"
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
                  Continue to login
                </Button>

                {/* Back Link */}
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    color: "#7C3AED",
                    fontWeight: "medium",
                    textTransform: "none",
                    textDecoration: "none",
                    background: "none",
                    "&:hover": { textDecoration: "none", background: "none" },
                  }}
                >
                  <ArrowBackIcon />
                  Back to home
                </Button>
              </Box>
            </Paper>
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: "60%",
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 480 }}>
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
                    Set new password
                  </Typography>
                </Box>
                <Typography sx={{ color: "#4D5764" }}>
                  Choose a strong password to protect your account
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
                <form onSubmit={handleSubmit(submitResetPassword)}>
                  {/* Password Fields */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {/* New Password */}
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="#57606D"
                        mb={1}
                      >
                        New Password
                      </Typography>
                      <Box sx={{ position: "relative" }}>
                        <TextField
                          required
                          fullWidth
                          type={showNewPassword ? "text" : "password"}
                          id="password"
                          variant="filled"
                          InputLabelProps={{ style: { color: "gray" } }}
                          autoComplete="password"
                          {...register("password")}
                          sx={{
                            mb: 2,
                            borderRadius: "12px",
                            backgroundColor: "#E9EDF6",
                            "& .MuiFilledInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#E9EDF6",
                              borderBottom: "none !important",
                              display: "flex",
                              alignItems: "center",

                              "&:before, &:after": {
                                display: "none",
                                backgroundColor: "#E9EDF6",
                              },
                            },
                            "& .MuiFilledInput-input": {
                              paddingY: "10px",
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  paddingBottom: "20px",
                                }}
                              >
                                <LockIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment
                                position="end"
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <IconButton
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                >
                                  {showNewPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      {errors.password && (
                        <FormErrors errors={errors.password.message} />
                      )}
                    </Box>

                    {/* Confirm Password */}
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="#57606D"
                        mb={1}
                      >
                        Confirm Password
                      </Typography>
                      <Box sx={{ position: "relative" }}>
                        <TextField
                          required
                          fullWidth
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          variant="filled"
                          InputLabelProps={{ style: { color: "gray" } }}
                          autoComplete="confirm-password"
                          {...register("confirmPassword")}
                          sx={{
                            mb: 2,
                            borderRadius: "12px",
                            backgroundColor: "#E9EDF6",
                            "& .MuiFilledInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#E9EDF6",
                              borderBottom: "none !important",
                              "&:before, &:after": {
                                display: "none",
                                backgroundColor: "#E9EDF6",
                              },
                            },
                            "& .MuiFilledInput-input": {
                              paddingY: "10px",
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  paddingBottom: "20px",
                                }}
                              >
                                <LockIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment
                                position="end"
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <IconButton
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      {errors.confirmPassword && (
                        <FormErrors errors={errors.confirmPassword.message} />
                      )}
                    </Box>

                    {/* Password Requirements */}
                    {/* Submit Button */}
                    <Button
                      type="submit"
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
                        "&:disabled": { cursor: "not-allowed", opacity: 0.7 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textTransform: "unset",
                        }}
                      >
                        <LockIcon style={{ marginRight: 8 }} />
                        <Typography
                          sx={{
                            textTransform: "unset",
                            marginTop: "2%",
                            fontWeight: "bold",
                          }}
                        >
                          Set new password
                        </Typography>
                      </Box>
                    </Button>

                    {/* Back to Login */}
                    <Link
                      to="/login"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textDecoration: "none",
                        marginTop: "4%",
                        gap: 4,
                        color: "#7A37ED",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      <ArrowBackIcon />
                      Back to login
                    </Link>
                  </Box>
                </form>
              </Paper>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ResetPasswordForm;
