import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Stack,
  Typography,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useUpdatePasswordMutation } from "../../app/slices/authApiSlice";
import { useGetMeQuery } from "../../app/slices/userApiSlice";
import { resetPasswordSchema } from "../../utils/schema";
import { ErrorData, ResetPasswordFormData } from "../../utils/types";

export default function SecurityTab() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: user } = useGetMeQuery("User", {
    refetchOnMountOrArgChange: true,
  });
  const email = user?.email ?? "";

  const [updatePassword, { isError, error, isSuccess, isLoading }] =
    useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const submitUpdatedPassword = async (data: ResetPasswordFormData) => {
    try {
      await updatePassword({ email, newPassword: data.password }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password Updated Successfully !", {
        position: "top-right",
        duration: 3000,
      });

      reset({
        password: "",
        confirmPassword: "",
      });
    }

    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData?.data?.error)) {
        errorData.data.error.forEach((el: { message: string }) =>
          toast.error(el.message, { position: "top-right" })
        );
      } else if (errorData?.data?.message) {
        toast.error(errorData.data.message, { position: "top-right" });
      } else {
        toast.error("Something went wrong", { position: "top-right" });
      }
    }
  }, [isSuccess, isError, error, reset]);

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Security Settings
        </Typography>
        <Typography color="text.secondary" sx={{ ml: 0.5}}>
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
              {/* New Password */}
              <TextField
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                fullWidth
                sx={fieldSx}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowNewPassword((s) => !s)}
                      edge="end"
                      size="small"
                      sx={{ color: "text.secondary" }}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </IconButton>
                  ),
                }}
                {...register("password")}
              />

              {/* Confirm New Password */}
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                sx={fieldSx}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      edge="end"
                      size="small"
                      sx={{ color: "text.secondary" }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </IconButton>
                  ),
                }}
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
