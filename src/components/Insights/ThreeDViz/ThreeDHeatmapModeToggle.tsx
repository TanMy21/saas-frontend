import { Box } from "@mui/material";

import { HeatmapMode } from "../../../types/behaviorTypes";

export function ThreeDHeatmapModeToggle({
  value,
  onChange,
}: {
  value: HeatmapMode;
  onChange: (value: HeatmapMode) => void;
}) {
  const options: { id: HeatmapMode; label: string }[] = [
    { id: "ALL", label: "All" },
    { id: "LIKE", label: "Liked" },
    { id: "DISLIKE", label: "Disliked" },
  ];

  return (
    <Box
      sx={{
        display: "inline-flex",
        border: "1px solid",
        borderColor: "transparent",
        bgcolor: "#f2f3f5",
        borderRadius: 1.5,
        p: 0.4,
        gap: 0.25,
      }}
    >
      {options.map((option) => {
        const isActive = value === option.id;

        return (
          <Box
            key={option.id}
            component="button"
            type="button"
            onClick={() => onChange(option.id)}
            sx={{
              border: 0,
              px: 1.5,
              py: 0.65,
              borderRadius: 1.1,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              color: isActive ? "text.primary" : "text.secondary",
              bgcolor: isActive ? "background.paper" : "transparent",
              boxShadow: isActive ? "0 1px 3px rgba(15, 23, 42, 0.10)" : "none",
              transition: "all 0.15s ease",
              "&:hover": {
                color: "text.primary",
                bgcolor: isActive
                  ? "background.paper"
                  : "rgba(255,255,255,0.55)",
              },
            }}
          >
            {option.label}
          </Box>
        );
      })}
    </Box>
  );
}
