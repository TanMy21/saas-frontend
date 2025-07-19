import { Box, Button, Container, Paper, Typography } from "@mui/material";

import { useAppTheme } from "../theme/useAppTheme";

const LoginAgain = () => {
  const { background, grey, shadows, text } = useAppTheme();
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
        <Box
          sx={{
            minHeight: "60%",
            marginTop: "8%",
            bgcolor: background.soft1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 640 }}>
            {/* Main Card */}
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: shadows[9],
              }}
            >
              {/* Email Status */}
              <Box sx={{ mb: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    p: 2,
                    bgcolor: background.softRed,
                    borderRadius: 2,
                    color: text.danger,
                    mb: 1,
                  }}
                >
                  <Typography fontWeight="bold">Login Again</Typography>
                </Box>
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1,
                    fontSize: "1rem",
                    color: grey[910],
                  }}
                >
                  Your session has expired. Please log in again to continue.
                </Typography>
              </Box>

              {/* Resend Email Button */}
              <Box sx={{ mb: 1 }}>
                <Button
                  fullWidth
                  variant="gradientPrimary"
                  //   onClick={handleResendCode}
                >
                  Login Again
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginAgain;
