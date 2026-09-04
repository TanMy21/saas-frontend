import type { ReactNode } from "react";

import { Box } from "@mui/material";

import type { PreviewViewport } from "./PreviewHeader";

type PreviewShellProps = {
  viewport: PreviewViewport;
  children: ReactNode;
};

const PreviewShell = ({ viewport, children }: PreviewShellProps) => {
  const isMobile = viewport === "mobile";

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: 1,
        minHeight: 0,
        boxSizing: "border-box",
        alignItems: "center",
        justifyContent: "center",
        overflow: "clip",
        p: { xs: 2, sm: 3 },
        backgroundColor: "#F4F6FA",
      }}
    >
      <Box
        component="div"
        aria-label={`${isMobile ? "Mobile" : "Desktop"} survey preview shell`}
        sx={{
          position: "relative",
          isolation: "isolate",
          width: isMobile ? 375 : 1440,
          height: isMobile ? 812 : "100%",
          minWidth: 0,
          minHeight: 0,
          maxWidth: "100%",
          maxHeight: "100%",
          boxSizing: "border-box",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "3px solid #E0E0E0",
          borderRadius: isMobile ? "36px" : "12px",
          backgroundColor: "#FFFFFF",
          boxShadow: isMobile
            ? "0 24px 60px rgba(16, 24, 40, 0.18)"
            : "0 12px 36px rgba(16, 24, 40, 0.08)",
          willChange: "width, height, border-radius",
          transition:
            "width 320ms cubic-bezier(0.22, 1, 0.36, 1), height 320ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 320ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 320ms ease",
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PreviewShell;
