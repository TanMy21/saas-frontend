import { Box, Typography } from "@mui/material";

import empty from "../assets/empty.svg";

const NoSurveysFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "40%",
        width: "100%",
        height: "250px",
        // border: "2px solid red",
      }}
    >
      {/* --- SVG --- */}
      <Box sx={{ width: 200, height: 200, mb: 0.5 }}>
        <img
          src={empty}
          style={{ width: "100%", height: "100%" }}
          alt="no surveys found"
        />
      </Box>

      <Typography
        sx={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1.2,
        }}
      >
        No surveys yet
      </Typography>
      <Typography
        variant="body2"
        noWrap
        sx={{
          fontSize: "1.2rem",
          color: "text.secondary",
          maxWidth: 400,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        Create a survey
      </Typography>
    </Box>
  );
};

export default NoSurveysFound;
