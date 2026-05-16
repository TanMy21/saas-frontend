import { useEffect } from "react";

import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import {
  useGetMeQuery,
  useResendVerificationEmailMutation,
} from "../app/slices/userApiSlice";
import VerificationEmailSent from "../components/auth/VerificationEmailSent";
import VerifyEmailCard from "../components/auth/VerifyEmailCard";
import usePersist from "../hooks/persist";
import { useToast } from "../hooks/useToast";

const EmailNotVerified = () => {
  const navigate = useNavigate();
  const [persist, setPersist] = usePersist();
  const [resendVerificationEmail, { isLoading, isSuccess, isError, error }] =
    useResendVerificationEmailMutation();

  const [sendLogout, { isSuccess: isSuccessLogout }] = useSendLogoutMutation();

  const { data: user } = useGetMeQuery("User");

  const email = user?.email || "";

  useEffect(() => {
    if (isSuccessLogout) navigate("/");
  }, [isSuccessLogout, navigate]);

  useToast({
    isError,
    error,
  });

  return (
    <Container component="main" maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isSuccess ? (
          <VerificationEmailSent email={email} />
        ) : (
          <VerifyEmailCard
            resendVerificationEmail={resendVerificationEmail}
            sendLogout={sendLogout}
            setPersist={setPersist}
            isLoading={isLoading}
            isSuccess={isSuccess}
            navigate={navigate}
            email={email}
          />
        )}
      </Box>
    </Container>
  );
};

export default EmailNotVerified;
