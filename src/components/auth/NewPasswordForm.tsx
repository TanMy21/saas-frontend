import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
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

import { useAppTheme } from "../../theme/useAppTheme";
import { resetPasswordSchema } from "../../utils/schema";
import { NewPasswordFormProps, ResetPasswordFormData } from "../../utils/types";
import FormErrors from "../FormErrors";

const NewPasswordForm = ({ code, resetPassword }: NewPasswordFormProps) => {
  const { textStyles, background, grey, shadows } = useAppTheme();
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

  return (
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
            <Typography sx={textStyles.strongH4}>Set new password</Typography>
          </Box>
          <Typography sx={{ color: grey[700] }}>
            Choose a strong password to protect your account
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
          <form onSubmit={handleSubmit(submitResetPassword)}>
            {/* Password Fields */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {/* New Password */}
              <Box>
                <Typography sx={textStyles.bodyGrey} mb={1}>
                  New Password
                </Typography>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    required
                    fullWidth
                    type={showNewPassword ? "text" : "password"}
                    id="password"
                    variant="filled"
                    InputLabelProps={{ style: { color: grey[900] } }}
                    autoComplete="password"
                    {...register("password")}
                    sx={{
                      mb: 2,
                      borderRadius: 3,
                      backgroundColor: background.neutral,
                      "& .MuiFilledInput-root": {
                        borderRadius: 3,
                        backgroundColor: background.neutral,
                        borderBottom: "none !important",
                        display: "flex",
                        alignItems: "center",

                        "&:before, &:after": {
                          display: "none",
                          backgroundColor: background.neutral,
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
                            onClick={() => setShowNewPassword(!showNewPassword)}
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
                <Typography sx={textStyles.bodyGrey} mb={1}>
                  Confirm Password
                </Typography>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    required
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    variant="filled"
                    InputLabelProps={{ style: { color: grey[900] } }}
                    autoComplete="confirm-password"
                    {...register("confirmPassword")}
                    sx={{
                      mb: 2,
                      borderRadius: 3,
                      backgroundColor: background.neutral,
                      "& .MuiFilledInput-root": {
                        borderRadius: 3,
                        backgroundColor: background.neutral,
                        borderBottom: "none !important",
                        "&:before, &:after": {
                          display: "none",
                          backgroundColor: background.neutral,
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
              <Button type="submit" fullWidth variant="submitDisabled1">
                <LockIcon style={{ marginRight: 8 }} />
                Set new password
              </Button>

              {/* Back to Login */}
              <Button component={Link} to="/login" variant="backLink1">
                <ArrowBackIcon />
                Back to login
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default NewPasswordForm;
