import { Box, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "60%",
            height: "50vh",
            margin: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
