import { useState } from "react";

import { Box, Container } from "@mui/material";

import { useForgotPasswordMutation } from "../app/slices/authApiSlice";
import PasswordResetForm from "../components/auth/PasswordResetForm";
import PasswordResetSuccess from "../components/auth/PasswordResetSuccess";
import { useToast } from "../hooks/useToast";

const ForgotPassword = () => {
  const [forgotPassword, { isSuccess, isError, error, isLoading, reset }] =
    useForgotPasswordMutation();
  const [submittedEmail, setSubmittedEmail] = useState("");

  useToast({
    isError,
    error,
  });

  return (
    <Container component="main" maxWidth="xl" sx={{ marginTop: "8%" }}>
      <Box
        sx={{
          marginTop: 1,
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
            {isSuccess ? (
              <PasswordResetSuccess
                submittedEmail={submittedEmail}
                reset={reset}
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
