import { Box, Typography } from "@mui/material";
import { ShieldAlert } from "lucide-react";

const ShareLockedSurveyNotice = () => {
  return (
    <Box
      sx={{
        mx: 3,
        mt: 2,
        px: 1.75,
        py: 1.4,
        display: "flex",
        alignItems: "flex-start",
        gap: 1.25,
        borderRadius: "14px",
        border: "1px solid #FECDD3",
        backgroundColor: "#FFF5F6",
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "9px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFE4E6",
          color: "#BE123C",
          flexShrink: 0,
        }}
      >
        <ShieldAlert size={17} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#881337",
            lineHeight: 1.35,
          }}
        >
          This survey is locked
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            fontSize: "12.5px",
            color: "#B45365",
            lineHeight: 1.45,
          }}
        >
          Shared links will show an locked screen, and respondents cannot submit
          responses.
        </Typography>
      </Box>
    </Box>
  );
};

export default ShareLockedSurveyNotice;
