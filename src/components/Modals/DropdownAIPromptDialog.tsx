import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { CircleX, Wand } from "lucide-react";

import { DropdownAIPromptDialogProps } from "../../types/surveyBuilderTypes";
 
export const DropdownAIPromptDialog = ({
  open,
  prompt,
  count,
  maxCount,
  isGenerating,
  onClose,
  onPromptChange,
  onCountChange,
  onGenerate,
}: DropdownAIPromptDialogProps) => {
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
            Generate dropdown options
          </Typography>

          <Typography sx={{ fontSize: 13, color: "#64748B", mt: 0.5 }}>
            Describe the options you want. You can review and edit them before
            adding.
          </Typography>
        </Box>

        <IconButton onClick={onClose}>
          <CircleX />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          multiline
          minRows={4}
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          placeholder="Example: Generate 20 job roles for a B2B SaaS survey"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#FFFFFF",
            },
          }}
        />

        <TextField
          type="number"
          label="Number of options"
          value={count}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            onCountChange(Math.max(1, Math.min(nextValue, maxCount)));
          }}
          inputProps={{
            min: 1,
            max: maxCount,
          }}
          sx={{
            width: 180,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 1,
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
              color: "#475569",
              fontWeight: 700,
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            startIcon={<Wand />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              fontWeight: 800,
              bgcolor: "#7C3AED",
              color: "white",
              "&:hover": {
                bgcolor: "#6D28D9",
              },
              "&.Mui-disabled": {
                bgcolor: "#CBD5E1",
                color: "white",
              },
            }}
          >
            {isGenerating ? "Generating..." : "Generate options"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};