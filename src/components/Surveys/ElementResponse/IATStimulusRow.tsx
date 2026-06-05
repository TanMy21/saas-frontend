import { useEffect, useState } from "react";

import { Box, IconButton, TextField, Typography } from "@mui/material";
import { CircleX } from "lucide-react";

import { IATStimulusRowProps } from "../../../types/surveyBuilderTypes";

export const IATStimulusRow = ({
  option,
  index,
  canEdit,
  canDelete,
  canReorder,
  dragHandleProps,
  onUpdate,
  onDelete,
}: IATStimulusRowProps) => {
  const [value, setValue] = useState(option.text || "");

  /**
   * Keeps local row text synced when server data changes.
   */
  useEffect(() => {
    setValue(option.text || "");
  }, [option.text]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        border: "1px solid #E2E8F0",
        borderRadius: 2,
        bgcolor: "#FFFFFF",
        px: 1,
        py: 0.75,
      }}
    >
      <Box
        {...dragHandleProps}
        sx={{
          width: 24,
          display: "flex",
          justifyContent: "center",
          color: canReorder ? "#94A3B8" : "#CBD5E1",
          cursor: canReorder ? "grab" : "default",
          fontWeight: 900,
          userSelect: "none",
        }}
      >
        ⋮⋮
      </Box>

      <Typography
        sx={{
          width: 24,
          fontSize: 12,
          fontWeight: 800,
          color: "#64748B",
          textAlign: "center",
        }}
      >
        {index + 1}
      </Typography>

      <TextField
        fullWidth
        variant="standard"
        disabled={!canEdit}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => onUpdate(option, value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onUpdate(option, value);
          }
        }}
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: 14,
            fontWeight: 600,
            color: "#0F172A",
          },
        }}
      />

      {canDelete && (
        <IconButton
          size="small"
          onClick={() => onDelete(option.optionID)}
          sx={{
            color: "#DC2626",
            "&:hover": {
              bgcolor: "#FEE2E2",
            },
          }}
        >
          <CircleX fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
