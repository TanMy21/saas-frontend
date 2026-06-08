import { IconButton, Tooltip } from "@mui/material";

export const ToolbarButton = ({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          size="small"
          disabled={disabled}
          onClick={onClick}
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            color: active ? "#FFFFFF" : "#475569",
            bgcolor: active ? "#475569" : "transparent",
            "&:hover": {
              bgcolor: active ? "#334155" : "#F1F5F9",
            },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};
