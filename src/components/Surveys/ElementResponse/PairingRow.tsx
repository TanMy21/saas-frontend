import { Box, Typography } from "@mui/material";

export const PairingRow = ({
  label,
  left,
  right,
}: {
  label: string;
  left: string;
  right: string;
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "80px 1fr 1fr" },
        gap: 1,
        alignItems: "center",
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#64748B" }}>
        {label}
      </Typography>

      <Box
        sx={{
          borderRadius: 1.5,
          bgcolor: "#F8FAFC",
          border: "1px solid #E2E8F0",
          p: 1,
          fontSize: 13,
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {left}
      </Box>

      <Box
        sx={{
          borderRadius: 1.5,
          bgcolor: "#F8FAFC",
          border: "1px solid #E2E8F0",
          p: 1,
          fontSize: 13,
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {right}
      </Box>
    </Box>
  );
};
