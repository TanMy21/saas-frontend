import { Box, Button, Container, Paper, TextField } from "@mui/material";
import { useForgotPasswordMutation } from "../app/slices/authApiSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetPasswordSchema } from "../utils/schema";
import { ErrorData, ForgotPasswordRequest } from "../utils/types";
import { useEffect } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import FormErrors from "../components/FormErrors";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";

const ForgotPassword = () => {
  const [forgotPassword, { isSuccess, isError, error }] =
    useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const submitForgotPasswordRequest = async (data: ForgotPasswordRequest) => {
    const { email } = data;
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
    <Container component="main" maxWidth="xs" sx={{ marginTop: "12%" }}>
      <Box
        sx={{
          marginTop: 8,
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
            <Paper
              elevation={8}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "92%",
                p: 4,
                borderRadius: "16px",
              }}
            >
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
                      width: "48px",
                      height: "48px",
                      fontSize: "32px",
                      color: "#344054",
                      border: "2px solid #E4E7EC",
                      borderRadius: "16%",
                    }}
                  >
                    <HiOutlineMail />
                  </Box>
                  <Box
                    sx={{
                      marginTop: "2%",
                      fontSize: "40px",
                      fontWeight: 600,
                      color: "#101828",
                    }}
                  >
                    Check your email
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "2%",
                      gap: 1,
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#475467",
                    }}
                  >
                    <Box>Didn't recevie the email?</Box>
                    <Box>
                      <Link to="/forgot" style={{ textDecoration: "none" }}>
                        click to resend
                      </Link>
                    </Box>
                  </Box>
                  <Box>
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
                <Box>
                  <Box>
                    <Box sx={{ fontSize: "32px", fontStyle: "bold" }}>
                      Forgot Password?
                    </Box>
                    <Box sx={{ color: "#434343" }}>
                      No worries, we'll send you reset instructions.
                    </Box>
                  </Box>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ mt: 1 }}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        autoComplete="email"
                        autoFocus
                        {...register("email")}
                      />
                      {errors.email && (
                        <FormErrors errors={errors.email.message} />
                      )}
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
                  </form>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                        fontWeight: 600,
                        width: "100%",
                        color: "black",
                      }}
                    >
                      <Box sx={{ fontSize: "20px", marginTop: "2%" }}>
                        <IoArrowBackOutline />
                      </Box>
                      <Box>Back to login</Box>
                    </Box>
                  </Link>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
