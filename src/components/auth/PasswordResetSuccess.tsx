import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowLeft, CheckCircleIcon, LockKeyholeIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { useResetPasswordMutation } from "../../app/slices/authApiSlice";
import { useToast } from "../../hooks/useToast";
import { useAppTheme } from "../../theme/useAppTheme";
import {
  PasswordResetOtpFormProps,
  ResetPasswordOtpFormValues,
} from "../../types/userTypes";
import { resetPasswordOtpSchema } from "../../utils/schema";
import FormErrors from "../FormErrors";

import { SixDigitOtpInput } from "./SixDigitOtpInput";

const PasswordResetOtpForm = ({
  submittedEmail,
  onUseDifferentEmail,
  onResend,
  isResending,
}: PasswordResetOtpFormProps) => {
  const { primary, background, grey, textStyles, shadows } = useAppTheme();

  const [
    resetPassword,
    {
      isLoading: isResetting,
      isSuccess: isPasswordResetSuccess,
      isError,
      error,
    },
  ] = useResetPasswordMutation();

  useToast({
    isError,
    error,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordOtpFormValues>({
    resolver: zodResolver(resetPasswordOtpSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submitPasswordReset = async (values: ResetPasswordOtpFormValues) => {
   console.log("Submitting password reset with values:", values.otp, values.password, submittedEmail);
   
    try {
      await resetPassword({
        email: submittedEmail,
        otp: values.otp,
        password: values.password,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const resendCode = async () => {
    try {
      await onResend();
    } catch (error) {
      console.error(error);
    }
  };

  if (isPasswordResetSuccess) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "60%",
          bgcolor: background.soft1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 480 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography sx={textStyles.gradientSecondary}>
              Password updated
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: shadows[9],
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 3,
                bgcolor: background.soft1,
                color: primary.main,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircleIcon style={{ fontSize: 36 }} />
            </Box>

            <Typography sx={textStyles.strongH6}>
              Password reset successfully
            </Typography>

            <Typography sx={{ color: grey[920], mt: 1, mb: 3 }}>
              You can now sign in using your new password.
            </Typography>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button fullWidth variant="gradientPrimary">
                Continue to sign in
              </Button>
            </Link>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "60%",
        bgcolor: background.soft1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 600 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
      

          <Typography sx={{ color: grey[955], mt: 1 }}>
            Enter the six-digit code sent to
          </Typography>

          <Typography sx={textStyles.strongH6}>{submittedEmail}</Typography>
        </Box>

        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: shadows[9],
          }}
        >
          <form
            onSubmit={handleSubmit(submitPasswordReset)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <SixDigitOtpInput
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.otp?.message}
                  disabled={isResetting || isResending}
                />
              )}
            />

            <Box>
              <TextField
                required
                fullWidth
                id="password"
                type="password"
                label="New password"
                variant="filled"
                autoComplete="new-password"
                error={Boolean(errors.password)}
                InputLabelProps={{
                  style: { color: grey[600] },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockKeyholeIcon style={{ color: grey[600] }} />
                    </InputAdornment>
                  ),
                }}
                {...register("password")}
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: 4,
                    backgroundColor: background.soft1,
                    borderBottom: "none !important",
                    "&:hover": {
                      backgroundColor: background.soft1,
                    },
                    "&.Mui-focused": {
                      backgroundColor: background.soft1,
                    },
                    "&:before, &:after": {
                      display: "none",
                    },
                  },
                }}
              />

              {errors.password && (
                <FormErrors errors={errors.password.message} />
              )}
            </Box>

            <Box>
              <TextField
                required
                fullWidth
                id="confirmPassword"
                type="password"
                label="Confirm new password"
                variant="filled"
                autoComplete="new-password"
                error={Boolean(errors.confirmPassword)}
                InputLabelProps={{
                  style: { color: grey[600] },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockKeyholeIcon style={{ color: grey[600] }} />
                    </InputAdornment>
                  ),
                }}
                {...register("confirmPassword")}
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: 4,
                    backgroundColor: background.soft1,
                    borderBottom: "none !important",
                    "&:hover": {
                      backgroundColor: background.soft1,
                    },
                    "&.Mui-focused": {
                      backgroundColor: background.soft1,
                    },
                    "&:before, &:after": {
                      display: "none",
                    },
                  },
                }}
              />

              {errors.confirmPassword && (
                <FormErrors errors={errors.confirmPassword.message} />
              )}
            </Box>

            <Button
              type="submit"
              disabled={isResetting || isResending}
              fullWidth
              variant="gradientPrimary"
            >
              {isResetting ? "Resetting password..." : "Reset password"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography component="span" sx={{ color: grey[920] }}>
                Didn't receive the code?
              </Typography>

              <Button
                type="button"
                onClick={resendCode}
                disabled={isResending || isResetting}
                variant="textLink1"
              >
                {isResending ? "Sending..." : "Resend code"}
              </Button>
            </Box>

            <Button
              type="button"
              onClick={onUseDifferentEmail}
              disabled={isResetting}
              variant="textLink1"
              fullWidth
            >
              <ArrowLeft style={{ marginRight: 8 }} />
              Use a different email
            </Button>
          </form>
        </Paper>

        <Typography
          sx={{
            color: grey[955],
            fontSize: "0.875rem",
            textAlign: "center",
            mt: 3,
          }}
        >
          The reset code expires after 10 minutes. Check your spam folder if you
          don't see the email.
        </Typography>
      </Box>
    </Box>
  );
};

export default PasswordResetOtpForm;
