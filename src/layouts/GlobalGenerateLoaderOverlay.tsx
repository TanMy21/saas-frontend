import { Box, Typography } from "@mui/material";

import { useAppSelector } from "../app/typedReduxHooks";
import GenerateSurveyAnimation from "../components/Loaders/GenerateSurveyAnimation";

export const GlobalGenerateLoaderOverlay = () => {
  const { overlayOpen, overlayMessage, overlayVariant } = useAppSelector(
    (state) => state.overlayUI,
  );

  if (!overlayOpen || overlayVariant !== "GENERATE") return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 600,
            color: "#0F172A",
          }}
        >
          Generating your survey...
        </Typography>

        {/* Dynamic message */}
        <Typography
          sx={{
            fontSize: 18,
            color: "#1E293B",
            textShadow: "0 1px 2px rgba(255,255,255,0.6)",
          }}
        >
          {overlayMessage || "Thinking..."}
        </Typography>

        <Typography
          sx={{
            fontSize: 16,
            color: "#64748B",
          }}
        >
          This may take up to a minute.
        </Typography>

        {/* Animation */}
        <Box
          sx={{
            position: "relative",
            mt: "8%",
            width: 400,
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // border: "1px solid red",
          }}
        >
          <GenerateSurveyAnimation />
        </Box>
      </Box>
    </Box>
  );
};
