import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography, Button } from "@mui/material";
import { useForm } from "react-hook-form";

import { useUpdatePasswordMutation } from "../../app/slices/authApiSlice";
import { useToast } from "../../hooks/useToast";
import { AccountSettings } from "../../types/userTypes";
import { updatePasswordSchema } from "../../utils/schema";
import { UpdatePasswordFormData } from "../../utils/types";

import LabeledField from "./LabelField";

export default function SecurityTab({ user }: AccountSettings) {
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
    } catch (e) {
      console.error(e);
    }
  };

  useToast({
    isSuccess,
    isError,
    error,
    successMessage: "Password updated successfully!",
    errorFallbackMessage: "Could not update password. Please try again.",
    successToastOptions: {
      duration: 3000,
    },
    onSuccess: () => {
      reset({
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
    },
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Security Settings
        </Typography>
        <Typography color="text.secondary" sx={{ ml: 0.5 }}>
          Manage your password and security preferences.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(submitUpdatedPassword)}>
        <Stack spacing={3.5}>
          {/* Change Password */}
          <Box sx={boxedSection}>
            <Typography fontWeight={700} sx={{ mb: 2 }}>
              Change Password
            </Typography>

            <Stack spacing={2}>
              {/* Current Password */}
              <LabeledField
                topLabel="Current Password"
                placeholder="Current Password"
                fullWidth
                sx={fieldSx}
                type="password"
                error={!!errors.currentPassword}
                showPassword={showCurrentPassword}
                onTogglePassword={() => setShowCurrentPassword((prev) => !prev)}
                helperText={errors.currentPassword?.message}
                {...register("currentPassword")}
              />

              {/* New Password */}
              <LabeledField
                topLabel="New Password"
                placeholder="New Password"
                fullWidth
                sx={fieldSx}
                type="password"
                error={!!errors.password}
                showPassword={showNewPassword}
                onTogglePassword={() => setShowNewPassword((prev) => !prev)}
                helperText={errors.password?.message}
                {...register("password")}
              />

              {/* Confirm New Password */}
              <LabeledField
                topLabel="Confirm New Password"
                placeholder="Confirm New Password"
                fullWidth
                sx={fieldSx}
                type="password"
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword((prev) => !prev)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={isSubmitting || isLoading || !isDirty}
              sx={{
                mt: 2.5,
                borderRadius: 2,
                fontWeight: 600,
                py: 1,
                color: "#fff",
                backgroundImage:
                  "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
                transition: "transform 200ms ease, box-shadow 200ms ease",
                boxShadow: "0 10px 20px rgba(0,116,235,0.25)",
                "&:hover": {
                  opacity: 0.95,
                  transform: "translateY(-1px)",
                },
                "&.Mui-disabled": { opacity: 0.5, color: "#fff" },
              }}
            >
              {isSubmitting || isLoading ? "Updating..." : "Update"}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}

const boxedSection = {
  border: "1px solid",
  borderColor: "rgba(148,163,184,0.35)",
  borderRadius: 3,
  p: 3,
  bgcolor: "rgba(255,255,255,0.6)",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "rgba(255,255,255,0.5)",
    "& fieldset": { borderColor: "rgba(148,163,184,0.35)" },
    "&:hover fieldset": { borderColor: "rgba(59,130,246,0.6)" },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(59,130,246,0.9)",
      boxShadow: "0 0 0 4px rgba(59,130,246,0.12)",
    },
  },
};
