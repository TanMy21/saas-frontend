import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import HomepageLogo from "../components/HomepageLogo";
import LogoLoader from "../components/Loaders/LogoLoader";

const Homepage = () => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          // border: "2px solid green",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "60%",
            height: "80%",
            margin: "auto",
            // border: "1px solid none",
          }}
        >
          <Box
            sx={{
              width: "92%",
              height: "20%",
              margin: "auto auto 0 auto",
              top: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // border: "2px solid blue",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "80%",
                height: "80%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <HomepageLogo />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "2%",
              width: "92%",
              height: "30%",
              margin: "0 auto 0 auto",
              // border: "2px solid orange",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3.75rem", md: "4.5rem" },
                fontWeight: "bold",
                background:
                  "linear-gradient(171deg,rgba(0, 127, 200, 1) 53%, rgba(0, 167, 193, 1) 93%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% 200%",
                animation: "gradientAnimation 3s ease infinite",
                letterSpacing: "-0.015em",
                display: "inline-block",
              }}
            >
              Welcome to Feedflo
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: { xs: "1.20rem", md: "1.5rem" },
                color: "#404968",
                maxWidth: "42rem",
                marginX: "auto",
                lineHeight: "1.625",
                textAlign: "center",
              }}
            >
              Your gateway to valuable insights
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "start",
              gap: "4%",
              width: "92%",
              height: "20%",
              margin: "auto",
              // border: "1px solid yellow",
            }}
          >
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  px: 4,
                  py: 2,
                  background:
                    "linear-gradient(171deg,rgba(0, 127, 200, 1) 53%, rgba(0, 167, 193, 1) 93%)",
                  color: "white",
                  borderRadius: "24px",
                  fontWeight: "600",
                  transition: "all 0.3s ease-in-out",
                  boxShadow:
                    "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  width: "260px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  backgroundSize: "200% 200%",
                  textTransform: "unset",
                  animation: "gradientAnimation 3s ease infinite",
                  "&:hover": {
                    boxShadow:
                      "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Get started <ArrowForwardIcon />
              </Button>
            </Link>{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  px: 4,
                  py: 2,
                  backgroundColor: "white",
                  color: "#182331",
                  borderRadius: "24px",
                  fontWeight: "600",
                  transition: "all 0.3s ease-in-out",
                  gap: 2,
                  boxShadow:
                    "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e5e7eb",
                  width: "260px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textTransform: "unset",
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                    boxShadow:
                      "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Sign in <LoginIcon />
              </Button>
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "5%",
            // border: "4px solid black",
          }}
        >
          <Typography sx={{ color: "#969EAE" }}>
            &copy; 2025 Feedflo. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Homepage;
