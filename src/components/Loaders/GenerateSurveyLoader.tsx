import { Box, CircularProgress, Typography } from "@mui/material";

const GenerateSurveyLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        width: "96%",
        height: "96%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress
          size={100}
          sx={{
            color: "#6366F1",
          }}
        />
        <Typography
          sx={{
            fontSize: "36px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #4B5563, #D1D5DB, #4B5563)",
            backgroundSize: "200% auto",
            marginTop: "2%",
            color: "transparent",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            animation: "shimmer 4s linear infinite",
            "@keyframes shimmer": {
              "0%": {
                backgroundPosition: "200% center",
              },
              "100%": {
                backgroundPosition: "-200% center",
              },
            },
          }}
        >
          Generating your survey
        </Typography>
        <Typography
          sx={{
            fontSize: "24px",
            color: "#71717A",
            marginTop: "8px",
            opacity: 0,
            animation: "fadeIn 2s ease forwards",
            "@keyframes fadeIn": {
              "to": { opacity: 1 },
            },
          }}
        >
          This may take up to a minute.
        </Typography>
      </Box>
    </Box>
  );
};

export default GenerateSurveyLoader;
