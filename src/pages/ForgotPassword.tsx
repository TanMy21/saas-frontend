import { useEffect, useState } from "react";

import { Box, Container } from "@mui/material";
import { toast } from "react-toastify";

import { useForgotPasswordMutation } from "../app/slices/authApiSlice";
import PasswordResetForm from "../components/auth/PasswordResetForm";
import PasswordResetSuccess from "../components/auth/PasswordResetSuccess";
import { ErrorData } from "../utils/types";

const ForgotPassword = () => {
  const [forgotPassword, { isSuccess, isError, error, isLoading, reset }] =
    useForgotPasswordMutation();
  const [submittedEmail, setSubmittedEmail] = useState("");
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
