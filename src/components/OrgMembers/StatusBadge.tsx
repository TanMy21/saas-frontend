import { Box } from "@mui/material";

 
export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, any> = {
    ACTIVE: { bgcolor: "rgba(16,185,129,0.12)", color: "#047857" },
    INVITED: { bgcolor: "rgba(249,115,22,0.12)", color: "#C2410C" },
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
        ...styles[status],
      }}
    >
      {status}
    </Box>
  );
};