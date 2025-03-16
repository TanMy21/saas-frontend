import { useEffect } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useVerifyEmailQuery } from "../app/slices/authApiSlice";
import { ErrorData } from "../utils/types";

const VerifyUser = () => {
  const { verificationCode } = useParams();

  const { isLoading, isSuccess, isError, error } =
    useVerifyEmailQuery(verificationCode);

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
    <Container component="main" maxWidth="xl" sx={{ marginTop: "4%" }}>
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
            width: "100%",
            p: 4,
          }}
        >
          <Box>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Box
                sx={{
                  width: "400px",
                  maxWidth: 400,
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
                          "linear-gradient(to right, #7C3AED, #EC4899)",
                      }}
                    >
                      {isSuccess ? "Welcome Aboard!" : "Invalid Link"}
                    </Typography>
                  </Box>
                  <Typography color="#4B5563">
                    {isSuccess
                      ? "Your gateway to valuable insights starts here"
                      : "This verification link is no longer valid"}
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
                    {/* Error Message or Success Message */}
                    <Box
                      sx={{
                        width: isSuccess ? 48 : "80%",
                        height: isSuccess ? 48 : "auto",
                        margin: "0 auto",
                        bgcolor: isSuccess ? "#EDF7ED" : "#FEF2F2",
                        borderRadius: isSuccess ? "50%" : 2,
                        p: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      {isSuccess ? (
                        <>
                          <TaskAltIcon
                            sx={{ color: "green", fontSize: "32px" }}
                          />
                        </>
                      ) : (
                        <>
                          {" "}
                          <ErrorOutlineIcon
                            sx={{
                              color: isSuccess ? "green" : "#DC2626",
                            }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="#991B1B"
                          >
                            Link expired or invalid
                          </Typography>
                        </>
                      )}
                    </Box>

                    {/* Action Button */}
                    <Button
                      component={Link}
                      to={isSuccess ? "/login" : "/forgot"}
                      fullWidth
                      sx={{
                        py: 1.5,
                        background:
                          "linear-gradient(to right, #7C3AED, #EC4899)",
                        color: "white",
                        borderRadius: 2,
                        fontWeight: "bold",
                        transition: "opacity 0.2s",
                        textTransform: "unset",
                        "&:hover": { opacity: 0.9 },
                      }}
                    >
                      {isSuccess
                        ? "Continue to Login"
                        : "Request new verification link"}
                    </Button>

                    {/* Back Link */}
                    <Link
                      to={"/"}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textDecoration: "none",
                        marginTop: "4%",
                        gap: 4,
                        color: "#7A37ED",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      <ArrowBackIcon />
                      Back to home
                    </Link>
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

export default VerifyUser;
