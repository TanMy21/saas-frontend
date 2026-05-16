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

import { useVerifyEmailQuery } from "../app/slices/authApiSlice";
import { useToast } from "../hooks/useToast";
import { useAppTheme } from "../theme/useAppTheme";

const VerifyUser = () => {
  const { textStyles, background, grey, shadows, iconStyle } = useAppTheme();

  const { verificationCode } = useParams();

  const { isLoading, isSuccess, isError, error } =
    useVerifyEmailQuery(verificationCode);

  useToast({
    isError,
    error,
  });

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
                    <Typography sx={textStyles.strongH4}>
                      {isSuccess ? "Welcome Aboard!" : "Invalid Link"}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: grey[900] }}>
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
                    boxShadow: shadows[9],
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
                        bgcolor: isSuccess
                          ? background.successSoft
                          : background.softRed,
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
                          <TaskAltIcon sx={iconStyle.success} />
                        </>
                      ) : (
                        <>
                          {" "}
                          <ErrorOutlineIcon
                            sx={{
                              color: isSuccess
                                ? background.success
                                : background.softRed,
                            }}
                          />
                          <Typography sx={textStyles.bodyDanger}>
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
                      variant="textLink2"
                    >
                      {isSuccess
                        ? "Continue to Login"
                        : "Request new verification link"}
                    </Button>

                    {/* Back Link */}
                    <Button
                      component={Link}
                      to={isSuccess ? "/login" : "/forgot"}
                      fullWidth
                      variant="textLink1"
                    >
                      <ArrowBackIcon />
                      Back to home
                    </Button>
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
