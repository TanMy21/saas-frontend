import { Box, Typography } from "@mui/material";

export const ImplicitAssociationTestBuilderNote = () => {
  return (
    <Box
      sx={{
        border: "1px dashed #CBD5E1",
        borderRadius: 2,
        bgcolor: "#F8FAFC",
        p: 2,
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#334155", mb: 0.5 }}>
        Setup note
      </Typography>

      <Typography sx={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
        IAT uses two targets, two attribute groups, practice blocks, and
        reversed pairings. It does not use normal answer options.
      </Typography>
    </Box>
  );
};

 