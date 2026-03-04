import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import GenerateSurveyAnimation from "./GenerateSurveyAnimation";

const statusMessages = [
  "Analyzing your input...",
  "Generating question set...",
  "Generating survey content...",
  "Finalizing your survey...",
];

const GenerateSurveyLoader = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

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
        <Typography
          sx={{
            fontSize: "28px",
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
          Generating your survey...
        </Typography>

        {/* Rotating Status Message */}
        <Typography
          key={index}
          sx={{
            fontSize: "18px",
            color: "#6B7280",
            minHeight: 28,
            animation: "fadeUp 0.4s ease",
            "@keyframes fadeUp": {
              from: { opacity: 0, transform: "translateY(6px)" },
              to: { opacity: 1, transform: "translateY(0px)" },
            },
          }}
        >
          {statusMessages[index]}
        </Typography>

        {/* Animation */}
        <Box
          sx={{
            position: "relative",
            height: 400,
            width: 300,
            marginTop: "4%",
            overflow: "hidden",
            isolation: "isolate",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GenerateSurveyAnimation />
        </Box>

        {/* footer text  */}

        <Typography
          sx={{
            fontSize: "24px",
            color: "#71717A",
            marginTop: "8px",
            marginBottom: "8%",
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
