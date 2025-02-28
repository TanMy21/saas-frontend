import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useUpdatePasswordMutation } from "../../app/slices/authApiSlice";
import { useGetMeQuery } from "../../app/slices/userApiSlice";
import { resetPasswordSchema } from "../../utils/schema";
import { ErrorData, ResetPasswordFormData } from "../../utils/types";
import FormErrors from "../FormErrors";

const UpdatePassword = () => {
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
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && <FormErrors errors={errors.password.message} />}
          </Box>
          <Box mt={2}>
            <TextField
              required
              fullWidth
              label="Confirm password"
              type="password"
              id="confirmPassword"
              autoComplete="confirm-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <FormErrors errors={errors.confirmPassword.message} />
            )}
          </Box>
          <Box mt={1}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                textTransform: "capitalize",
                backgroundColor: "#7F56D9",
                fontWeight: 600,
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#7F56D9",
                },
              }}
            >
              Update Password
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default UpdatePassword;
