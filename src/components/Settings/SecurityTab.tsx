import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography, Button } from "@mui/material";
import { useForm } from "react-hook-form";

import { useUpdatePasswordMutation } from "../../app/slices/authApiSlice";
import { logOut } from "../../app/slices/authSlice";
import { useAppDispatch } from "../../app/typedReduxHooks";
import { useToast } from "../../hooks/useToast";
import { updatePasswordSchema } from "../../utils/schema";
import { UpdatePasswordFormData } from "../../utils/types";

import LabeledField from "./LabelField";

export default function SecurityTab() {
  const dispatch = useAppDispatch();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updatePassword, { isError, error, isSuccess, isLoading }] =
    useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submitUpdatedPassword = async (data: UpdatePasswordFormData) => {
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.password,
      }).unwrap();

      dispatch(logOut());

      window.location.href = "/login?reason=password-updated";
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };

  useToast({
    isSuccess,
    isError,
    error,
    successMessage: "Password updated successfully!",
    errorFallbackMessage: "Unable to update your password. Please try again.",
    successToastOptions: {
      duration: 3000,
    },

    onSuccess: () => {
      reset();
    },
  });

  return (
    <Box
      sx={{
        width: "92%",
        p: { xs: 2.5, sm: 4 },
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: "1.3rem", sm: "1.45rem" },
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.025em",
            color: "#0F172A",
          }}
        >
          Security
        </Typography>

        <Typography
          sx={{
            mt: 0.9,
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: "#64748B",
          }}
        >
          Manage your password and account access.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(submitUpdatedPassword)}>
        <Box sx={passwordSectionSx}>
          <Stack spacing={2.25}>
            <LabeledField
              topLabel="Current password"
              placeholder="Enter your current password"
              fullWidth
              sx={passwordFieldSx}
              type="password"
              autoComplete="current-password"
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              showPassword={showCurrentPassword}
              onTogglePassword={() =>
                setShowCurrentPassword((previous) => !previous)
              }
              {...register("currentPassword")}
            />

            <LabeledField
              topLabel="New password"
              placeholder="Create a new password"
              fullWidth
              sx={passwordFieldSx}
              type="password"
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              showPassword={showNewPassword}
              onTogglePassword={() =>
                setShowNewPassword((previous) => !previous)
              }
              {...register("password")}
            />

            <LabeledField
              topLabel="Confirm new password"
              placeholder="Re-enter your new password"
              fullWidth
              sx={passwordFieldSx}
              type="password"
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword((previous) => !previous)
              }
              {...register("confirmPassword")}
            />
          </Stack>

          <Box
            sx={{
              mt: 3,
              pt: 2.5,
              borderTop: "1px solid rgba(148,163,184,0.22)",
              display: "flex",
              justifyContent: { xs: "stretch", sm: "flex-end" },
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={isSubmitting || isLoading || !isDirty}
              sx={{
                minHeight: 42,
                width: { xs: "100%", sm: "auto" },
                px: 3,
                borderRadius: 2,
                fontSize: "0.875rem",
                fontWeight: 750,
                letterSpacing: "0.01em",
                color: "#fff",
                backgroundImage:
                  "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
                boxShadow: "0 8px 18px rgba(0,116,235,0.22)",
                transition:
                  "transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease",

                "&:hover:not(.Mui-disabled)": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 12px 24px rgba(0,116,235,0.3)",
                  backgroundImage:
                    "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
                },

                "&:active:not(.Mui-disabled)": {
                  transform: "translateY(0)",
                },

                "&.Mui-disabled": {
                  opacity: 0.5,
                  color: "#fff",
                  boxShadow: "none",
                },
              }}
            >
              {isSubmitting || isLoading
                ? "Updating password..."
                : "Update password"}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

const passwordSectionSx = {
  p: { xs: 2.25, sm: 3 },
};

const passwordFieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    borderRadius: 2.25,
    backgroundColor: "rgba(255,255,255,0.78)",
    transition:
      "border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",

    "& fieldset": {
      borderColor: "rgba(148,163,184,0.38)",
      transition: "border-color 180ms ease",
    },

    "&:hover": {
      backgroundColor: "#fff",

      "& fieldset": {
        borderColor: "rgba(0,116,235,0.55)",
      },
    },

    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 4px rgba(0,116,235,0.11)",

      "& fieldset": {
        borderColor: "#0074EB",
      },
    },

    "& input": {
      fontSize: "0.925rem",
      fontWeight: 500,
      color: "#0F172A",
    },

    "& input::placeholder": {
      color: "#94A3B8",
      opacity: 1,
    },
  },
};
