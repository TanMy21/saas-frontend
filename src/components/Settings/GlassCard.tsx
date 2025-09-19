import { Box } from "@mui/material";

type Props = React.PropsWithChildren<{ sx?: any }>;

export default function GlassCard({ children, sx }: Props) {
  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(6px)",
        borderRadius: 4,
        boxShadow: "0px 10px 30px rgba(2, 6, 23, 0.06)",
        border: "1px solid rgba(255,255,255,0.25)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
