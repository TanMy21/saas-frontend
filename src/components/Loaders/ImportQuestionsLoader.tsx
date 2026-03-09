import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import ImportLoaderAnimation from "./ImportLoaderAnimation";

export const ImportQuestionsLoader = ({ slow }: { slow?: boolean }) => {
  const messages = [
    "Analyzing your input...",
    "Identifying questions and options...",
    "Preparing your survey...",
    "Finalizing your survey...",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
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
          gap: 3,
        }}
      >
        {/* Title */}
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

        {/* Step Progress */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.8,
            alignItems: "flex-start",
            minHeight: 100,
          }}
        >
          {messages.slice(0, index + 1).map((msg, i) => (
            <Typography
              key={i}
              sx={{
                fontSize: 17,
                color: i === index ? "#374151" : "#9CA3AF",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: i === index ? 500 : 400,
                transition: "all 0.3s ease",
              }}
            >
              {i < index ? "✓" : "⏳"} {msg}
            </Typography>
          ))}
        </Box>

        {/* Loader animation  */}
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
          <ImportLoaderAnimation />
        </Box>

        {/* state message */}
        <Typography
          sx={{
            fontSize: 20,
            color: slow ? "#EF4444" : "#9CA3AF",
            mt: 1,
            transition: "all 0.3s ease",
          }}
        >
          {slow
            ? "This is taking longer than usual..."
            : "Large imports may take a little longer."}
        </Typography>
      </Box>
    </Box>
  );
};
