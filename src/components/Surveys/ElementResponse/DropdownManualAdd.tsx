import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { CirclePlus, Wand } from "lucide-react";

import { DropdownManualAddProps } from "../../../types/surveyBuilderTypes";

export const DropdownManualAdd = ({
  inputValue,
  disabled,
  onInputChange,
  onAddOptions,
  onOpenAI,
}: DropdownManualAddProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: "#334155",
          }}
        >
          Add options
        </Typography>

        <Button
          onClick={onOpenAI}
          disabled={disabled}
          startIcon={<Wand size={18} />}
          sx={{
            textTransform: "none",
            borderRadius: 999,
            px: 1.5,
            py: 0.6,
            fontSize: 13,
            fontWeight: 700,
            color: "#6D28D9",
            bgcolor: "#F5F3FF",
            border: "1px solid #DDD6FE",
            "&:hover": {
              bgcolor: "#EDE9FE",
            },
            "&.Mui-disabled": {
              color: "#94A3B8",
              bgcolor: "#F1F5F9",
              borderColor: "#E2E8F0",
            },
          }}
        >
          Generate with AI
        </Button>
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          px: 1,
          pt: 0.75,
          pb: 0.75,
          border: "1px solid #E2E8F0",
          borderRadius: 2,
          bgcolor: "#FFFFFF",
        }}
      >
        <TextField
          multiline
          minRows={1}
          disabled={disabled}
          placeholder="Type or paste dropdown options, one per line…"
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              bgcolor: "transparent",
              lineHeight: 1.6,
              fontSize: 15,
              color: "inherit",
              pr: 5,
            },
          }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              bgcolor: "transparent",
            },
          }}
        />

        <IconButton
          onClick={onAddOptions}
          disabled={disabled || inputValue.trim() === ""}
          aria-label="Add dropdown options"
          sx={{
            position: "absolute",
            right: 8,
            bottom: 7,
            width: 34,
            height: 34,
            borderRadius: "50%",
            bgcolor: "#7C3AED",
            color: "white",
            boxShadow: "0 6px 16px rgba(124,58,237,0.25)",
            "&:hover": { bgcolor: "#6D28D9" },
            "&.Mui-disabled": {
              bgcolor: "#CBD5E1",
              color: "white",
            },
          }}
        >
          <CirclePlus size={20} />
        </IconButton>
      </Box>
    </Box>
  );
};
