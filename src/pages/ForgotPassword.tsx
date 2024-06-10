import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForgotPasswordMutation } from "../app/slices/authApiSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetPasswordSchema } from "../utils/schema";
import { ForgotPasswordRequest } from "../utils/types";
import { useState } from "react";
import FormErrors from "../components/FormErrors";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  // const [forgotPassword, { isSuccess, isError, error }] =
  //   useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const submitForgotPasswordRequest = async (data: ForgotPasswordRequest) => {
    console.log(data);
    if (data) {
      setEmailSent(true);
    }
    // try {
    //   const response = await forgotPassword(data).unwrap();
    //   console.log(response);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const onSubmit = (data: ForgotPasswordRequest) => {
    console.log("Submitting form...");
    submitForgotPasswordRequest(data);
  };

  console.log("Email Sent: ", emailSent);

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
        <Paper
          elevation={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
            p: 4,
          }}
        >
          <Box>
            {emailSent ? (
              <Alert
                severity="success"
                sx={{
                  fontSize: "24px",
                  "& .MuiAlert-icon": {
                    fontSize: "32px",
                    marginTop: "12%",
                  },
                }}
              >
                Email sent! Check your inbox for further instructions.
              </Alert>
            ) : (
              <>
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
                      sx={{ mt: 3, mb: 2, textTransform: "capitalize" }}
                    >
                      Reset Password
                    </Button>
                  </Box>
                </form>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
