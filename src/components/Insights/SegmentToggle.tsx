import { Box, Button } from "@mui/material";

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentToggleProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * SegmentToggle
 * UI-only conversion from Tailwind + cn to MUI sx
 */
export function SegmentToggle({
  options,
  value,
  onChange,
  className,
}: SegmentToggleProps) {
  return (
    // Root container (replaces inline-flex + bg-muted + p-1)
    <Box
      className={className}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        bgcolor: "action.hover", // bg-muted
        p: 0.5, // p-1
        borderRadius: 1, // rounded-lg
      }}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          // Each toggle button
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            variant="text"
            size="small"
            sx={{
              px: 1.5, // px-3
              py: 0.75, // py-1.5
              minWidth: "auto",
              borderRadius: 1, // rounded-md
              textTransform: "none",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s ease",

              // Active state (bg-card + shadow-sm)
              ...(isActive && {
                bgcolor: "background.paper",
                color: "text.primary",
                boxShadow: 1,
              }),

              // Inactive state
              ...(!isActive && {
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                  bgcolor: "transparent",
                },
              }),
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </Box>
  );
}
