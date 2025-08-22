import { useEffect } from "react";

import { Tooltip } from "@mui/material";

import { EnterToEditTooltipProps } from "../../utils/types";

const EnterToEditTooltip = ({
  children,
  open,
  onOpenChange,
  title = "Press Enter to edit",
  placement = "top",
  tooltipSx,
  autoHideMs = 1800,
  disableHoverListener = true,
  disableTouchListener = true,
}: EnterToEditTooltipProps) => {
  useEffect(() => {
    if (!open || !autoHideMs) return;
    const id = setTimeout(() => onOpenChange?.(false), autoHideMs);
    return () => clearTimeout(id);
  }, [open, autoHideMs, onOpenChange]);

  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={false}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "#0f172a",
            color: "#ffffff",
            fontSize: "0.95rem",
            fontWeight: 500,
            letterSpacing: "0.3px",
            borderRadius: "10px",
            px: 2,
            py: 1,
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
            ...tooltipSx,
          },
        },
      }}
      open={open}
      disableHoverListener={disableHoverListener}
      disableTouchListener={disableTouchListener}
    >
      {children}
    </Tooltip>
  );
};

export default EnterToEditTooltip;
