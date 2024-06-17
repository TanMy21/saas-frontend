import { Link } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";

const Homepage = () => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box sx={{ marginTop: "16%" }}>
          <Typography variant="h1">Landing Page</Typography>
        </Box>
        <Box sx={{ m: 4 }}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#4F46E5",
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#4F46E5",
                  },
                }}
                variant="contained"
                size="large"
              >
                Sign up
              </Button>
            </Link>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#494454",
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#494454",
                  },
                }}
                variant="contained"
                size="large"
              >
                Sign in
              </Button>
            </Link>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default Homepage;
