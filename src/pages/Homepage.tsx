import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import HomepageLogo from "../components/HomepageLogo";
import { useElectricTheme } from "../theme/useElectricTheme";

const Homepage = () => {
  const { textStyles, background, grey } = useElectricTheme();

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
          backgroundColor: background.paper,
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
                width: { md: "200px", xl: "80%" },
                height: { md: "200px", xl: "80%" },
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
              p: 2,
              width: { md: "98%", xl: "92%" },
              height: "30%",
              margin: "0 auto",
              marginTop: { md: "4%" },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
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
              <Button variant="getStarted">
                Get started <ArrowForwardIcon />
              </Button>
            </Link>{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: background.paper,
              }}
            >
              <Button variant="landingSignIn">
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
          <Typography sx={{ color: grey[200] }}>
            &copy; 2025 Feedflo. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Homepage;
