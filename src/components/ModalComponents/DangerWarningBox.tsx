import { Box, Typography } from "@mui/material";

export const DangerWarningBox = ({ text }: { text: string }) => (
  <Box
    sx={{
      display: "flex",
      width: "92%",
      p: 2,
      bgcolor: "#fef2f2",
      borderRadius: 3,
      border: "1px solid #fee2e2",
    }}
  >
    <Typography sx={{ color: "#991b1b", fontWeight: 600 }}>{text}</Typography>
  </Box>
);
