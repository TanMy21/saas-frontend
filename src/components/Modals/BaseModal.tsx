import { Box, IconButton, Modal, Typography } from "@mui/material";
import { X } from "lucide-react";

import { BaseModalProps } from "../../types/modalTypes";

export const BaseModal = ({
  open,
  onClose,
  icon,
  title,
  subtitle,
  children,
  width = 500,
}: BaseModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width,
          bgcolor: "#fff",
          borderRadius: "14px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          mx: "auto",
          mt: "10vh",
          py: 1.5,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            pb: 1,
          }}
        >
          {/* Left */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                backgroundColor: "#EFF6FF",
                borderRadius: 1,
                display: "flex",
              }}
            >
              {icon}
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "24px",
                  color: "grey.900",
                }}
              >
                {title}
              </Typography>

              {subtitle && (
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "grey.500",
                    mt: 0.3,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Close */}
          <IconButton
            onClick={onClose}
            sx={{
              p: 1,
              color: "grey.400",
              "&:hover": {
                color: "grey.600",
                bgcolor: "grey.100",
              },
              borderRadius: 2,
            }}
          >
            <X style={{ width: 28, height: 28 }} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ px: 2 }}>{children}</Box>
      </Box>
    </Modal>
  );
};
