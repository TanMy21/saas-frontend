import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import { LoaderMode } from "../../types/modalTypes";
import { loaderMessages, loaderTitles } from "../../utils/constants";

import GenerateSurveyAnimation from "./GenerateSurveyAnimation";
import { GenerateSurveyAppendAnimation } from "./GenerateSurveyAppendAnimation";
import { GenerateSurveyReplaceAnimation } from "./GenerateSurveyReplaceAnimation";

type GenerateSurveyLoaderProps = {
  showTimeoutWarning: boolean;
  mode: LoaderMode;
};

const GenerateSurveyLoader = ({
  showTimeoutWarning,
  mode,
}: GenerateSurveyLoaderProps) => {
  const [index, setIndex] = useState(0);
  const statusMessages = loaderMessages[mode];
  const title = loaderTitles[mode];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev < statusMessages.length - 1 ? prev + 1 : prev));
    }, 4000);

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
          {title}
        </Typography>

        {/* Rotating Status Message */}
        {!showTimeoutWarning ? (
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
        ) : (
          <Typography
            sx={{
              fontSize: "18px",
              color: "#DC2626",
              fontWeight: 500,
              minHeight: 28,
              animation: "fadeUp 0.4s ease",
            }}
          >
            This is taking longer than expected. Please wait...
          </Typography>
        )}

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
          {
            {
              INITIAL: <GenerateSurveyAnimation />,
              APPEND: <GenerateSurveyAppendAnimation />,
              REPLACE: <GenerateSurveyReplaceAnimation />,
            }[mode]
          }
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
