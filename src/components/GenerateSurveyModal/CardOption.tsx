import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Typography } from "@mui/material";

type CardOptionProps = {
  title: string;
  description: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

export const CardOption = ({
  title,
  description,
  onClick,
  variant = "primary",
}: CardOptionProps) => {
  const isSecondary = variant === "secondary";

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: isSecondary ? "#e5e7eb" : "#e2e8f0",
        bgcolor: isSecondary ? "#fafafa" : "#ffffff",
        display: "flex",
        alignItems: "center",
        gap: 2,
        marginBottom: 1,
        cursor: "pointer",
        transition: "all 0.18s ease",
        "&:hover": {
          borderColor: "#cbd5f5",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 15,
            color: isSecondary ? "#374151" : "#111827",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: "#6b7280",
            mt: 0.5,
          }}
        >
          {description}
        </Typography>
      </Box>

      <ChevronRightIcon sx={{ color: "#9ca3af" }} />
    </Box>
  );
};
