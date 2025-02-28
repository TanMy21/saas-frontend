import { Alert, Box, Button, Container } from "@mui/material";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

import {
  useGetMeQuery,
  useResendVerificationEmailMutation,
} from "../app/slices/userApiSlice";

const EmailNotVerified = () => {
  const [resendVerificationEmail, { isLoading, isSuccess }] =
    useResendVerificationEmailMutation();

  const { data: user } = useGetMeQuery("User");

  const email = user?.email || "";



  const handleResendCode = async () => {
    try {
      await resendVerificationEmail(email).unwrap();
    } catch (err) {
      console.error("Failed to resend verification code: ", err);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ marginTop: "12%" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isSuccess ? (
          <Box
            sx={{
              margin: "auto",
              width: "96%",
            }}
          >
            <Alert
              severity="info"
              sx={{
                fontSize: "32px",
                "& .MuiAlert-icon": {
                  fontSize: "40px",
                },
              }}
            >
              Verification Email Sent, Please Check Your Email.
            </Alert>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 600,
                  color: "#494454",
                }}
              >
                <Box sx={{ fontSize: "32px", marginTop: "1%" }}>
                  <IoMdArrowRoundBack />
                </Box>
                <Box sx={{ fontSize: "28px" }}>Back to Login</Box>
              </Box>
            </Link>
          </Box>
        ) : (
          <Box
            sx={{
              margin: "auto",
              width: "44%",
            }}
          >
            <Alert
              severity="error"
              sx={{
                fontSize: "32px",
                "& .MuiAlert-icon": {
                  fontSize: "40px",
                },
              }}
            >
              Email Not Verified.
            </Alert>
            <Button
              onClick={handleResendCode}
              fullWidth
              variant="contained"
              disabled={isLoading || isSuccess}
              sx={{
                mt: 2,
                mb: 2,
                fontWeight: 700,
                fontSize: "20px",
                backgroundColor: "#4C6FFF",
                textTransform: "capitalize",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#4C6FFF",
                },
              }}
            >
              {isLoading ? "Sending..." : "Resend Verification Email"}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default EmailNotVerified;
