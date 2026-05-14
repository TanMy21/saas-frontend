import { Box, Typography } from "@mui/material";
import { ShieldAlert } from "lucide-react";

const SurveyLockedBanner = () => {
  return (
    <Box
      sx={{
        width: "68%",
        minHeight: "44px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: 3,
        border: "1px solid #FECDD3",
        backgroundColor: "#FFF5F6",
        mx: "auto",
        borderRadius: "16px",
        marginTop: 2,
        marginBottom: 0,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFE4E6",
          color: "#BE123C",
          flexShrink: 0,
        }}
      >
        <ShieldAlert size={24} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#881337",
            lineHeight: 1.3,
          }}
        >
          Survey locked
        </Typography>

        <Typography
          sx={{
            fontSize: "14px",color: "#B45365",
            lineHeight: 1.4,
          }}
        >
          This survey has been locked due to a content or policy concern. You can still edit
          it, but respondents cannot submit responses.
        </Typography>
      </Box>
    </Box>
  );
};

export default SurveyLockedBanner;
