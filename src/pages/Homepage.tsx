import { useState } from "react";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import Features from "../components/Features";
import Footer from "../components/Footer";
import HomepageLogo from "../components/HomepageLogo";
import SuccessfullLogoutToast from "../components/toast/SuccessfullLogoutToast";
import { useAppTheme } from "../theme/useAppTheme";

const Homepage = () => {
  const { textStyles, background } = useAppTheme();
  const params = new URLSearchParams(location.search);

  const successfulLogout = params.get("logout") === "success";
  const [showLogoutAlert, setShowLogoutAlert] = useState(true);

  return (
    <>
      {successfulLogout && showLogoutAlert && (
        <SuccessfullLogoutToast
          showLogoutAlert={showLogoutAlert}
          setShowLogoutAlert={setShowLogoutAlert}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          // minHeight: "100vh",
          overflowX: "hidden",
          overflowY: "auto",
          backgroundColor: background.paper,
        }}
      >
        {/* Page Content Wrapper */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "1200px",
            px: 2,
            py: 6,
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: { md: "200px", xl: "300px" },
                height: { md: "200px", xl: "300px" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <HomepageLogo />
            </Box>
          </Box>

          {/* Welcome Text */}
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography sx={textStyles.gradientPrimary}>
                Welcome to
              </Typography>
              <Typography
                sx={{ ...textStyles.gradientPrimary, fontStyle: "italic" }}
              >
                &nbsp;Feedflo
              </Typography>
            </Box>
            <Typography sx={textStyles.subtitleText}>
              Design smarter surveys — your gateway to valuable insights
            </Typography>
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              mb: 8,
            }}
          >
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Button variant="getStarted">
                Get started <ArrowForwardIcon />
              </Button>
            </Link>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: background.paper }}
            >
              <Button variant="landingSignIn">
                Sign in <LoginIcon />
              </Button>
            </Link>
          </Box>
        </Box>

        {/* Features */}
        <Box width="100%">
          <Features />
        </Box>

        {/* Footer */}
        <Box width="100%">
          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default Homepage;
