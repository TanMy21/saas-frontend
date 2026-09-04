import { Box, Button, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PreviewViewport } from "./PreviewHeader";

type PreviewNavigationProps = {
  currentIndex: number;
  totalQuestions: number;
  viewport: PreviewViewport;
  onPrevious: () => void;
  onNext: () => void;
};

const PreviewNavigation = ({
  currentIndex,
  totalQuestions,
  viewport,
  onPrevious,
  onNext,
}: PreviewNavigationProps) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const isMobile = viewport === "mobile";

  return (
    <Box
      component="div"
      data-ignore-scrollnav="true"
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 60,
        width: "100%",
        borderTop: 0,
        backgroundColor: "transparent",
        pt: isMobile ? 1 : 0,
        backdropFilter: "none",
        pointerEvents: "none",
      }}
    >
      <Box
        component="nav"
        aria-label="Preview question navigation"
        sx={{
          position: "relative",
          display: "flex",
          width: "100%",
          boxSizing: "border-box",
          minHeight: isMobile ? 64 : 56,
          alignItems: "center",
          justifyContent: isMobile ? "center" : "flex-end",
          pr: isMobile ? 0 : "8%",
          pb: isMobile
            ? "max(env(safe-area-inset-bottom), 12px)"
            : "max(env(safe-area-inset-bottom), 8px)",
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 0.5,
            borderRadius: 999,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
            backdropFilter: "blur(4px)",
            pointerEvents: "auto",
          }}
        >
          {!isFirst && (
            <IconButton
              onClick={onPrevious}
              aria-label="Previous"
              sx={{
                width: 44,
                height: 44,
                p: 1,
                color: "#374151",
                transition: "color 150ms ease, transform 150ms ease",
                "&:hover": {
                  color: "#000000",
                  backgroundColor: "transparent",
                },
                "&:active": { transform: "scale(0.94)" },
              }}
            >
              <ChevronLeft size={isMobile ? 24 : 28} />
            </IconButton>
          )}

          {!isLast && (
            <Button
              onClick={onNext}
              aria-label="Next"
              disableElevation
              sx={{
                width: isMobile ? "auto" : 44,
                minWidth: 44,
                height: 44,
                px: isMobile ? 2.5 : 1,
                py: 1,
                borderRadius: 999,
                color: isMobile ? "#FFFFFF" : "#374151",
                backgroundColor: isMobile ? "#005BC4" : "transparent",
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1,
                textTransform: "none",
                transition:
                  "color 150ms ease, background-color 150ms ease, transform 150ms ease",
                "&:hover": {
                  color: isMobile ? "#FFFFFF" : "#000000",
                  backgroundColor: isMobile ? "#004A9F" : "transparent",
                },
                "&:active": { transform: "scale(0.94)" },
              }}
            >
              {isMobile ? "Ok" : <ChevronRight size={28} />}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PreviewNavigation;
