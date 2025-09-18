import { useEffect } from "react";

import Close from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

import { Modal3DModelProps } from "../../utils/types";

const Upload3DModelModal = ({
  isOpen,
  onClose,
  children,
  title,
}: Modal3DModelProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") onClose();
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        },
      }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 720,
          borderRadius: 4,
          boxShadow: 24,
        },
      }}
      sx={{
        "& .MuiDialog-container": {
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        },
      }}
      transitionDuration={300}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          py: 2.5,
          borderBottom: "1px solid",
          borderColor: "grey.100",
          fontWeight: 800,
          fontSize: 24,
        }}
      >
        {title}
        <IconButton
          onClick={onClose}
          sx={{
            p: 1,
            borderRadius: 2,
            color: "grey.500",
            "&:hover": {
              color: "grey.700",
              backgroundColor: "grey.100",
            },
            transition: "all .2s ease",
          }}
        >
          <Close fontSize="medium" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>{children}</DialogContent>
    </Dialog>
  );
};

export default Upload3DModelModal;
