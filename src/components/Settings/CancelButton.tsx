import { Button } from "@mui/material";

type Props = React.PropsWithChildren<{ onClick?: () => void; sx?: any }>;

export default function CancelButton({ children, onClick, sx }: Props) {
  return (
    <Button
      onClick={onClick}
      sx={{
        px: 3,
        py: 1,
        borderRadius: 2,
        fontWeight: 600,
        color: "text.primary",
        backgroundColor: "rgba(15, 23, 42, 0.06)",
        transition: "background-color 200ms ease",
        "&:hover": { backgroundColor: "rgba(15, 23, 42, 0.10)" },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
