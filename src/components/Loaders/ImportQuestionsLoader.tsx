import { Box, Typography } from "@mui/material";

import ImportLoaderAnimation from "./ImportLoaderAnimation";

export const ImportQuestionsLoader = ({
  slow,
  message,
}: {
  slow?: boolean;
  message?: string;
}) => {
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
            fontSize: 32,
            fontWeight: 600,
            color: "#0F172A",
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
          <Typography
            sx={{
              fontSize: 24,
              color: "#1E293B",
              textShadow: "0 1px 2px rgba(255,255,255,0.6)",
              fontWeight: 500,
            }}
          >
            {message || "Processing..."}
          </Typography>
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
            fontSize: 24,
            color: slow ? "#DC2626" : "#64748B",
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
