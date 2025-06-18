import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useUpdatePasswordMutation } from "../../app/slices/authApiSlice";
import { useGetMeQuery } from "../../app/slices/userApiSlice";
import { useAppTheme } from "../../theme/useAppTheme";
import { resetPasswordSchema } from "../../utils/schema";
import { ErrorData, ResetPasswordFormData } from "../../utils/types";
import FormErrors from "../FormErrors";

const UpdatePassword = () => {
  const { grey, brand } = useAppTheme();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: user } = useGetMeQuery("User", {
    refetchOnMountOrArgChange: true,
  });

  const [updatePassword, { isError, error, isSuccess }] =
    useUpdatePasswordMutation();

  const { email } = user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const submitUpdatedPassword = async (data: ResetPasswordFormData) => {
    const { password: newPassword } = data;
    try {
      await updatePassword({ email, newPassword }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password Updated Successfully !", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
    }

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
  }, [isSuccess, isError, error]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "48%",
        mt: 2,
      }}
    >
      <form onSubmit={handleSubmit(submitUpdatedPassword)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            width: "92%",
            mt: 2,
          }}
        >
          <Box mt={2}>
            <TextField
              required
              fullWidth
              type={showNewPassword ? "text" : "password"}
              label="Password"
              id="password"
              variant="filled"
              InputLabelProps={{ style: { color: grey[900] } }}
              {...register("password")}
              sx={{
                mb: 2,
                borderRadius: 3,
                backgroundColor: brand.bgColor2,
                "& .MuiFilledInput-root": {
                  height: "52px",
                  borderRadius: 3,
                  backgroundColor: brand.bgColor2,
                  borderBottom: "none !important",
                  display: "flex",
                  alignItems: "center",

                  "&:before, &:after": {
                    display: "none",
                    backgroundColor: brand.bgColor2,
                  },
                },
                "& .MuiFilledInput-input": {
                  paddingTop: "24px",
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
                      paddingBottom: "1px",
                    }}
                  >
                    <LockIcon sx={{ fontSize: "20px" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
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
            {errors.password && <FormErrors errors={errors.password.message} />}
          </Box>
          <Box mt={2}>
            <TextField
              required
              fullWidth
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              variant="filled"
              InputLabelProps={{ style: { color: grey[900] } }}
              {...register("confirmPassword")}
              sx={{
                mb: 2,
                borderRadius: 3,
                backgroundColor: brand.bgColor2,
                "& .MuiFilledInput-root": {
                  height: "52px",
                  borderRadius: 3,
                  backgroundColor: brand.bgColor2,
                  borderBottom: "none !important",
                  "&:before, &:after": {
                    display: "none",
                    backgroundColor: brand.bgColor2,
                  },
                },
                "& .MuiFilledInput-input": {
                  paddingTop: "24px",
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
                      paddingBottom: "1px",
                    }}
                  >
                    <LockIcon sx={{ fontSize: "20px" }} />
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
            {errors.confirmPassword && (
              <FormErrors errors={errors.confirmPassword.message} />
            )}
          </Box>
          <Box mt={1}>
            <Button type="submit" fullWidth variant="submit1">
              Update Password
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default UpdatePassword;
