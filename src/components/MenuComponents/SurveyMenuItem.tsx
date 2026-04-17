import { Box, MenuItem, type Theme } from "@mui/material";

export const SurveyMenuItem = ({
  icon,
  label,
  onClick,
  right,
  danger = false,
  disabled = false,
}: {
  icon?: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}) => {
  return (
    <MenuItem
      onClick={onClick}
      disabled={disabled}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1.5,
        py: 1,
        mx: 1,
        fontSize: 14,
        fontWeight: 600,
        color: danger ? "#D32F2F" : "#374151",
        transition: "all 0.2s ease",
        borderRadius: "8px",
        "&.Mui-selected": {
          borderRadius: "12px",
        },
        "&.Mui-selected:hover": {
          borderRadius: "12px",
        },
        "&:hover": {
          borderRadius: "12px",
          backgroundColor: (t: Theme) =>
            danger
              ? t.palette.mode === "dark"
                ? "rgba(244,67,54,.12)"
                : "rgba(244,67,54,.06)"
              : t.palette.mode === "dark"
                ? "rgba(144,202,249,.12)"
                : "rgba(25,118,210,.06)",
        },
      }}
    >
      {/* left */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        {icon}
        {label}
      </Box>

      {/* right */}
      {right}
    </MenuItem>
  );
};
