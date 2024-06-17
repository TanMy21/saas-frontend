import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useVerifyEmailQuery } from "../app/slices/authApiSlice";

const VerifyUser = () => {
  const { verificationCode } = useParams();

  const { isLoading, isSuccess, isError } =
    useVerifyEmailQuery(verificationCode);

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
            width: "80%",
            p: 4,
          }}
        >
          <Box>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Alert
                    severity={isSuccess ? "success" : "error"}
                    sx={{
                      fontSize: "24px",
                      "& .MuiAlert-icon": {
                        fontSize: "32px",
                        marginTop: isSuccess ? "12%" : "2%",
                      },
                    }}
                  >
                    {isSuccess
                      ? "Your account has been verified. You can now login."
                      : "Invalid Link."}
                  </Alert>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isError && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "4%",
                      }}
                    >
                      <Typography
                        mt={2}
                        color={"darkred"}
                        fontStyle={"bold"}
                        fontSize={"16px"}
                      >
                        The link is either invalid or expired.{" "}
                      </Typography>
                      <Link
                        to="/forgot"
                        style={{ padding: 5, marginTop: "4%" }}
                      >
                        Get a new link
                      </Link>
                    </Box>
                  )}
                </Box>
                <Box mt={2}>
                  <Link to="/" style={{ padding: 5 }}>
                    Back to home
                  </Link>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default VerifyUser;
