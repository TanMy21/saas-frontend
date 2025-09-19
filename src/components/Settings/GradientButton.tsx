import { Button, CircularProgress } from "@mui/material";

type Props = React.PropsWithChildren<{
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  sx?: any;
}>;

export default function GradientButton({
  children,
  loading,
  disabled,
  onClick,
  sx,
}: Props) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        px: 3,
        py: 1,
        borderRadius: 2,
        fontWeight: 600,
        color: "#fff",
        gap: 1,
        backgroundImage: "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
        transition:
          "transform 200ms ease, box-shadow 200ms ease, opacity 200ms ease",
        boxShadow: "0 10px 20px rgba(37, 99, 235, 0.25)",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 14px 28px rgba(37, 99, 235, 0.32)",
          backgroundImage: "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
        },
        "&.Mui-disabled": {
          opacity: 0.5,
          color: "#fff",
        },
        ...sx,
      }}
    >
      {loading && (
        <CircularProgress size={16} thickness={5} sx={{ color: "white" }} />
      )}
      {children}
    </Button>
  );
}
