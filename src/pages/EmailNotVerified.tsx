import { useEffect } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useGetMeQuery } from "../app/slices/userApiSlice";
import { savePendingVerificationEmail } from "../utils/verificationSession";

const EmailNotVerified = () => {
  const navigate = useNavigate();
  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMeQuery("User");

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    savePendingVerificationEmail(user.email);
    navigate("/verify", { replace: true });
  }, [navigate, user?.email]);

  if (isLoading || isFetching || user?.email) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography sx={{ mb: 2 }}>
          {isError
            ? "We couldn't load the email for this account."
            : "No email address is available for verification."}
        </Typography>

        <Button variant="contained" onClick={() => void refetch()}>
          Try again
        </Button>
      </Box>
    </Container>
  );
};

export default EmailNotVerified;
