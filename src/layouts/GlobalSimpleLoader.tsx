import { Box, Typography } from "@mui/material";

const GlobalSimpleLoader = ({
  overlayMessage,
}: {
  overlayMessage?: string;
}) => {
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
          gap: 2.5,
          animation: "simpleOverlayEnter 0.25s ease-out",
          "@keyframes simpleOverlayEnter": {
            from: {
              opacity: 0,
              transform: "translateY(8px) scale(0.98)",
            },
            to: {
              opacity: 1,
              transform: "translateY(0) scale(1)",
            },
          },
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "4px solid rgba(0, 116, 235, 0.16)",
            borderTopColor: "#0074EB",
            animation: "simpleOverlaySpin 0.8s linear infinite",
            "@keyframes simpleOverlaySpin": {
              to: {
                transform: "rotate(360deg)",
              },
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 24, sm: 28 },
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "-0.5px",
              textAlign: "center",
            }}
          >
            {overlayMessage || "Processing"}
          </Typography>

          <Box
            component="span"
            sx={{
              display: "inline-flex",
              gap: "3px",
              mt: "8px",
            }}
          >
            {[0, 1, 2].map((dot) => (
              <Box
                key={dot}
                component="span"
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  bgcolor: "#0074EB",
                  animation: "simpleOverlayDot 1s ease-in-out infinite",
                  animationDelay: `${dot * 0.15}s`,
                  "@keyframes simpleOverlayDot": {
                    "0%, 80%, 100%": {
                      opacity: 0.35,
                      transform: "translateY(0)",
                    },
                    "40%": {
                      opacity: 1,
                      transform: "translateY(-5px)",
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GlobalSimpleLoader;
