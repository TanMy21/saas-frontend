import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { useElectricTheme } from "../../theme/useElectricTheme";

const InvalidResetLinkCard = () => {
  const { textStyles, background, grey, shadows, iconStyle } =
    useElectricTheme();
  return (
    <Box
      sx={{
        margin: "auto",
        width: "100%",
        maxWidth: 480,
        textAlign: "center",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography sx={textStyles.strongH4}>Invalid link</Typography>
        </Box>
        <Typography sx={{ color: grey[900] }}>
          This verification link is no longer valid
        </Typography>
      </Box>
      {/* Main Card */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: shadows[9],
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              background: background.softRed,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <NotInterestedIcon sx={iconStyle.errorLarge} />
          </Box>
          {/* Status Alert */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: background.softRed,
              borderRadius: 2,
              p: 2,
              gap: 2,
            }}
          >
            <ErrorOutlineIcon sx={iconStyle.alert} />
            <Typography sx={textStyles.bodyDanger}>
              Link expired or invalid
            </Typography>
          </Box>

          {/* Icon and Message */}
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: grey[900] }}>Don't worry!</Typography>
            <Typography sx={{ color: grey[900] }}>
              You can request a new password reset link.
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              component={Link}
              to="/forgot"
              variant="getStarted"
            >
              Request new password reset link
              <ArrowBackIcon style={{ transform: "rotate(180deg)" }} />
            </Button>
            <Button component={Link} to="/login" fullWidth variant="backLink1">
              <ArrowBackIcon />
              Back to login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvalidResetLinkCard;
