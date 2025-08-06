import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { useAppTheme } from "../../theme/useAppTheme";

const HeroSection = () => {
  const { textStyles, background } = useAppTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "1200px",
        marginTop: "4%",
        px: 2,
        py: 4,
        // border: "2px solid red",
      }}
    >
      {/* Welcome Text */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography sx={textStyles.gradientPrimary}>Welcome to</Typography>
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
        <Link to="/register" style={{ textDecoration: "none", color: "white" }}>
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
  );
};

export default HeroSection;
