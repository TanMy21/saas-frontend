import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import { WiStars } from "react-icons/wi";

import ImportLoaderAnimation from "./ImportLoaderAnimation";

export const ImportQuestionsLoader = () => {
  const messages = [
    "Analyzing your input...",
    "Identifying questions and options...",
    "Preparing your survey...",
    "Finalizing your survey...",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
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
          gap: 2,
        }}
      >
        <Box
          sx={{
            marginX: "auto",
            width: 100,
            height: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WiStars size={80} color="#6366F1" />
        </Box>

        {/* Main Title */}
        <Typography
          sx={{
            fontSize: 26,
            fontWeight: 600,
            color: "#111827",
            letterSpacing: "-0.3px",
          }}
        >
          Composing your survey...
        </Typography>

        {/* Rotating intelligent status */}
        <Typography
          key={index}
          sx={{
            fontSize: 18,
            color: "#6B7280",
            transition: "opacity 0.4s ease",
            animation: "fadeIn 0.4s ease",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(4px)" },
              to: { opacity: 1, transform: "translateY(0px)" },
            },
          }}
        >
          {messages[index]}
        </Typography>

        {/* Animated Icon + Glow Ring */}
        <Box
          sx={{
            position: "relative",
            width: 110,
            height: 110,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Soft Pulsing Glow */}
          <Box
            sx={{
              position: "absolute",
              width: 110,
              height: 110,
              borderRadius: "50%",
            }}
          />

          {/* Circular Progress Ring */}
          <ImportLoaderAnimation />
        </Box>

        {/* Calm microcopy */}
        <Typography
          sx={{
            fontSize: 20,
            color: "#9CA3AF",
            mt: 1,
          }}
        >
          Large imports may take a little longer.
        </Typography>
      </Box>
    </Box>
  );
};

export default ImportQuestionsLoader;
