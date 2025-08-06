import { useState } from "react";

import { Box, Container } from "@mui/material";

import Features from "../components/landingpage/Features";
import Footer from "../components/landingpage/Footer";
import Header from "../components/landingpage/Header";
import HeroSection from "../components/landingpage/HeroSection";
import StatsSection from "../components/landingpage/StatsSection";
import SuccessfullLogoutToast from "../components/toast/SuccessfullLogoutToast";
import { useAppTheme } from "../theme/useAppTheme";

const Homepage = () => {
  const { background } = useAppTheme();
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
          overflowX: "hidden",
          overflowY: "auto",
          backgroundColor: background.paper,
        }}
      >
        <Header />
        {/* Hero Section */}
        <Box sx={{ width: "100%", backgroundColor: "#FFFFFF", py: 10 }}>
          <Container maxWidth="lg">
            <HeroSection />
          </Container>
        </Box>

        {/* Stats section */}
        <Box sx={{ width: "100%", backgroundColor: "#F9FAFB", py: 10 }}>
          <Container maxWidth="lg">
            <StatsSection />
          </Container>
        </Box>

        {/* Features */}
        <Box sx={{ width: "100%", backgroundColor: "#FFFFFF", py: 10 }}>
          <Container maxWidth="lg">
            <Features />
          </Container>
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
