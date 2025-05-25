import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";

import ResetPasswordForm from "../components/auth/ResetPasswordForm";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

  return (
    <Container component="main" maxWidth="xl" sx={{ marginTop: "2%" }}>
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
              <ResetPasswordForm code={code} />
            ) : (
              <Box
                sx={{
                  margin: "auto",
                  width: "100%",
                  maxWidth: 480,
                  textAlign: "center",
                }}
              >
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        backgroundClip: "text",
                        textFillColor: "transparent",
                        backgroundImage:
                          "linear-gradient(171deg,rgba(0, 127, 200, 1) 53%, rgba(0, 167, 193, 1) 93%)",
                      }}
                    >
                      Invalid link
                    </Typography>
                  </Box>
                  <Typography color="#4B5563">
                    This verification link is no longer valid
                  </Typography>
                </Box>

                {/* Main Card */}
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        background: "#FEF2F2",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <NotInterestedIcon
                        sx={{ color: "#DC2626", fontSize: "32px" }}
                      />
                    </Box>
                    {/* Status Alert */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#FEF2F2",
                        borderRadius: 2,
                        p: 2,
                        gap: 2,
                      }}
                    >
                      <ErrorOutlineIcon sx={{ color: "#EF4444" }} />
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="#7F1D1D"
                      >
                        Link expired or invalid
                      </Typography>
                    </Box>

                    {/* Icon and Message */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography color="#4B5563">Don't worry!</Typography>
                      <Typography color="#4B5563">
                        You can request a new password reset link.
                      </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Button
                        fullWidth
                        component={Link}
                        to="/forgot"
                        sx={{
                          py: 1.5,
                          background:
                            "linear-gradient(171deg,rgba(0, 127, 200, 1) 53%, rgba(0, 167, 193, 1) 93%)",
                          color: "white",
                          borderRadius: 2,
                          fontWeight: "bold",
                          transition: "opacity 0.2s",
                          textTransform: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          "&:hover": { opacity: 0.9 },
                        }}
                      >
                        Request new password reset link
                        <ArrowBackIcon
                          style={{ transform: "rotate(180deg)" }}
                        />
                      </Button>

                      <Button
                        component={Link}
                        to="/login"
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderRadius: 4,
                          fontWeight: "medium",
                          color: "#7C3AED",
                          transition: "all 0.2s",
                          textTransform: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          textDecoration: "none",
                          background: "none",
                          "&:hover": {
                            textDecoration: "none",
                            background: "none",
                          },
                        }}
                      >
                        <ArrowBackIcon />
                        Back to login
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
