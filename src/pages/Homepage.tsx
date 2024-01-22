import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h1">Homepage</Typography>
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
                style={{ backgroundColor: "#3C46FF" }}
                variant="contained"
                size="large"
              >
                Sign up
              </Button>
            </Link>
            <Button
              style={{ backgroundColor: "#08088C" }}
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
