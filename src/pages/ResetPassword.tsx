import { Alert, Box, Container } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

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
            width: "90%",
            p: 2,
          }}
        >
          <Box sx={{ width: "100%" }}>
            {linkIsValid ? (
              <ResetPasswordForm code={code!} />
            ) : (
              <Box>
                <Box
                  sx={{
                    margin: "auto",
                    width: "72%",
                  }}
                >
                  <Alert
                    severity="error"
                    sx={{
                      fontSize: "24px",
                      "& .MuiAlert-icon": {
                        fontSize: "32px",
                      },
                    }}
                  >
                    Invalid Link.
                  </Alert>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "auto",
                    marginTop: "4%",
                  }}
                >
                  <Link
                    to="/forgot"
                    style={{
                      padding: 5,
                      textDecoration: "none",
                      fontStyle: "bold",
                    }}
                  >
                    Request a new password reset link
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

export default ResetPassword;
