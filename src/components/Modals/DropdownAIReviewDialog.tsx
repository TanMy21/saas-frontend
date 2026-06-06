import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";

import { useAppTheme } from "../../theme/useAppTheme";
import { DropdownAIReviewDialogProps } from "../../types/surveyBuilderTypes";

export const DropdownAIReviewDialog = ({
  open,
  options,
  onClose,
  onBack,
  onUpdateOption,
  onDeleteOption,
  onAddReviewedOptions,
  isAddingReviewedOptions,
}: DropdownAIReviewDialogProps) => {
    const { scrollStyles } = useAppTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
        transition: { duration: 0.22, ease: "easeOut" },
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
            Review generated options
          </Typography>

          <Typography sx={{ fontSize: 13, color: "#64748B", mt: 0.5 }}>
            Edit or remove options before adding them to this dropdown.
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            p: 1,
            color: "grey.400",
            transition: "all 0.2s",
            "&:hover": {
              color: "grey.600",
              bgcolor: "grey.100",
            },
            borderRadius: 2,
          }}
        >
          <CloseIcon style={{ width: 28, height: 28 }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          p: 2.5,
          maxHeight: 460,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          bgcolor: "#F8FAFC",
        }}
      >
        {options.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center",
              py: 4,
              fontSize: 14,
              color: "#64748B",
            }}
          >
            No generated options left.
          </Typography>
        ) : (
          options.map((option, index) => (
            <Box
              key={`${option.order}-${index}`}
              component={motion.div}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.18,
                delay: Math.min(index * 0.015, 0.18),
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                border: "1px solid #E2E8F0",
                borderRadius: 2,
                bgcolor: "#FFFFFF",
                 ...scrollStyles.elementsPanel,
              }}
            >
              <Typography
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "#F1F5F9",
                  color: "#475569",
                  fontSize: 12,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </Typography>

              <TextField
                value={option.text}
                onChange={(event) => onUpdateOption(index, event.target.value)}
                variant="standard"
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0F172A",
                  },
                }}
              />

              <IconButton
                onClick={() => onDeleteOption(index)}
                aria-label="Remove generated option"
                sx={{
                  color: "#991B1B",
                  flexShrink: 0,
                }}
              >
                <CircleX fontSize="small" />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          bgcolor: "#FFFFFF",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "#64748B" }}>
          {options.length} option(s) ready to add
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={onBack}
            sx={{
              textTransform: "none",
              color: "#475569",
              fontWeight: 700,
            }}
          >
            Back
          </Button>

          <Button
            onClick={onAddReviewedOptions}
            disabled={options.length === 0 || isAddingReviewedOptions}
            sx={{
              px: 3,
              py: 1.3,
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              bgcolor: "#2563eb",
              borderRadius: 2,
              boxShadow: "0 2px 8px 0 rgba(59,130,246,0.09)",
              transition: "all 0.18s",
              "&:hover": {
                bgcolor: "#1d4ed8",
              },
            }}
          >
            {isAddingReviewedOptions
              ? "Adding options..."
              : "Add reviewed options"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
