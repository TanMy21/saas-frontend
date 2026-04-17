import { Box, MenuItem } from "@mui/material";

export const AccountMenuItem = ({
  icon,
  label,
  onClick,
  sx = {},
  danger = false,
}: {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  onClick: () => void;
  sx?: object;
  danger?: boolean;
}) => {
  return (
    <MenuItem
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        fontSize: "12px",
        fontWeight: "bold",
        color: danger ? "red" : "#333B70",
        mx: 1,
        borderRadius: "8px",
        "&:hover": {
          borderRadius: "12px",
        },
        "&.Mui-selected": {
          borderRadius: "12px",
        },
        "&.Mui-selected:hover": {
          borderRadius: "12px",
        },
        ...sx,
      }}
    >
      <Box sx={{ width: 24, display: "flex", justifyContent: "center" }}>
        {icon}
      </Box>

      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>{label}</Box>
    </MenuItem>
  );
};
