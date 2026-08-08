import { useState } from "react";

import { Box, Container } from "@mui/material";

import { useForgotPasswordMutation } from "../app/slices/authApiSlice";
import PasswordResetForm from "../components/auth/PasswordResetForm";
import PasswordResetOtpForm from "../components/auth/PasswordResetSuccess";
import { useToast } from "../hooks/useToast";

const ForgotPassword = () => {
  const [forgotPassword, { isSuccess, isError, error, isLoading, reset }] =
    useForgotPasswordMutation();

  const [submittedEmail, setSubmittedEmail] = useState("");

  useToast({
    isError,
    error,
  });

  const resendPasswordResetOtp = async () => {
    if (!submittedEmail) return;

    try {
      await forgotPassword(submittedEmail).unwrap();
    } catch (error) {
      console.error("Failed to resend password reset OTP:", error);
    }
  };

  const useDifferentEmail = () => {
    reset();
    setSubmittedEmail("");
  };

  return (
    <Container component="main" maxWidth="xl" sx={{ marginTop: "8%" }}>
      <Box component="div"
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "92%",
            p: 4,
          }}
        >
          <Box component="div">
            {isSuccess ? (
              <PasswordResetOtpForm
                submittedEmail={submittedEmail}
                onUseDifferentEmail={useDifferentEmail}
                onResend={resendPasswordResetOtp}
                isResending={isLoading}
              />
            ) : (
              <PasswordResetForm
                isLoading={isLoading}
                isSuccess={isSuccess}
                setSubmittedEmail={setSubmittedEmail}
                forgotPassword={forgotPassword}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
