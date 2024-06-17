import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import FormErrors from "./FormErrors";
import { useResetPasswordMutation } from "../app/slices/authApiSlice";
import { ResetPassword, ResetPasswordFormData } from "../utils/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../utils/schema";
import { FaLock, FaRegCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const ResetPasswordForm = ({ code }: ResetPassword) => {
  const [resetPassword, { isSuccess }] = useResetPasswordMutation();

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
    <>
      <Paper
        elevation={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          borderRadius: "12px",
        }}
      >
        {" "}
        {isSuccess ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "4%",
                width: "48px",
                height: "48px",
                fontSize: "32px",
                color: "#4F8074",
                border: "2px solid #4F8074",
                borderRadius: "16%",
              }}
            >
              <FaRegCircleCheck />
            </Box>
            <Box
              sx={{
                marginTop: "2%",
                fontSize: "24px",
                fontWeight: 600,
                color: "#007B52",
              }}
            >
              Password Reset Successfully
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: "2%",
                width: "92%",
                gap: 1,
                fontSize: "16px",
                fontWeight: 600,
                color: "#475467",
              }}
            >
              <Box
                sx={{
                  fontWeight: 600,
                  color: "#475467",
                  textAlign: "center",
                }}
              >
                Your password has been Successfully reset. You can now log in
              </Box>
            </Box>
            <Box sx={{ marginBottom: "4%" }}>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#6941C6" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "4%",

                    gap: 1,
                    fontWeight: 600,
                    width: "100%",
                    color: "black",
                  }}
                >
                  <Box sx={{ fontSize: "20px", marginTop: "6%" }}>
                    <IoArrowBackOutline />
                  </Box>
                  <Box>Back to login</Box>
                </Box>
              </Link>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "4%",
                width: "48px",
                height: "48px",
                fontSize: "24px",
                color: "#344054",
                border: "2px solid #E4E7EC",
                borderRadius: "16%",
              }}
            >
              <FaLock />
            </Box>
            <Box>
              <Typography
                sx={{
                  marginTop: "2%",
                  fontSize: "32px",
                  fontWeight: 600,
                  color: "#101828",
                }}
              >
                Set new password
              </Typography>
            </Box>
            <Box sx={{ width: "80%" }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#475467",
                  textAlign: "center",
                }}
              >
                Your new password must be different from previously used
                passwords.
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <form onSubmit={handleSubmit(submitResetPassword)}>
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
                    {errors.password && (
                      <FormErrors errors={errors.password.message} />
                    )}
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
                      Reset Password
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default ResetPasswordForm;
