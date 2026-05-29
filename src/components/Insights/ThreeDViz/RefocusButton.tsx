import { Box } from "@mui/material";
import { Html, useBounds } from "@react-three/drei";
import { Focus } from "lucide-react";

export function ResultRefocusButton() {
  const bounds = useBounds();

  const frameAll = () => {
    // Recomputes model bounds and fits the camera around the model.
    bounds.refresh().fit();
  };

  return (
    <Html transform={false} fullscreen>
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 1,
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={frameAll}
          title="Fit to view"
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,.12)",
            background: "rgba(255,255,255,.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            cursor: "pointer",
          }}
        >
          <Focus size={16} />
        </button>
      </Box>
    </Html>
  );
}
