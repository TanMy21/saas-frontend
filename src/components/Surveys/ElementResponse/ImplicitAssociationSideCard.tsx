import { Box, Typography } from "@mui/material";

export const ImplicitAssociationSideCard = ({
  keyLabel,
  title,
}: {
  keyLabel: string;
  title: string;
}) => {
  return (
    <Box
      sx={{
        border: "1px solid #F9A8D4",
        borderRadius: 2,
        bgcolor: "#FFFFFF",
        p: 1.5,
        textAlign: "center",
        minHeight: 88,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ fontSize: 12, color: "#64748B", mb: 0.5 }}>
        {keyLabel}
      </Typography>

      <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
        {title}
      </Typography>
    </Box>
  );
};
