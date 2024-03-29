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
        <Typography variant="h1">Landing Page</Typography>
        <Box sx={{ m: 4 }}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Button
                style={{ backgroundColor: "#0068FF" }}
                variant="contained"
                size="large"
              >
                Sign up
              </Button>
            </Link>
            <Button
              style={{ backgroundColor: "#44546A" }}
              variant="contained"
              size="large"
            >
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "white" }}
              >
                Sign in
              </Link>
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default Homepage;
