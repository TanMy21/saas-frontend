import { Box } from "@mui/material";

export const RoleBadge = ({ role }: { role: string }) => {
  const styles: Record<string, any> = {
    OWNER: { bgcolor: "rgba(245,158,11,0.12)", color: "#B45309" },
    ADMIN: { bgcolor: "rgba(0,116,235,0.08)", color: "#005BC4" },
    ANALYST: { bgcolor: "rgba(139,92,246,0.10)", color: "#6D28D9" },
    VIEWER: { bgcolor: "rgba(15,23,42,0.06)", color: "#334155" },
  };

  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        display: "inline-block",
        ...styles[role],
      }}
    >
      {role}
    </Box>
  );
};
