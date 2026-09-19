import type { RefObject } from "react";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  ClickAwayListener,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

type EditableMediaOptionLabelProps = {
  label: string;
  draftLabel: string;
  isEditing: boolean;
  error: string;
  canEdit: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onStartEditing: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

const EditableMediaOptionLabel = ({
  label,
  draftLabel,
  isEditing,
  error,
  canEdit,
  inputRef,
  onStartEditing,
  onChange,
  onSave,
  onCancel,
}: EditableMediaOptionLabelProps) => (
  <Box
    component="div"
    sx={{
      display: "flex",
      alignItems: "flex-start",
      minHeight: 52,
      pt: 1,
      width: "100%",
    }}
  >
    {isEditing ? (
      <ClickAwayListener onClickAway={onSave}>
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: "100%",
            gap: 0.5,
          }}
        >
          <Box component="div" sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              inputRef={inputRef}
              size="small"
              fullWidth
              value={draftLabel}
              error={Boolean(error)}
              helperText={error}
              inputProps={{
                "aria-label": "Media option name",
              }}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSave();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  onCancel();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0074EB",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputBase-input": {
                  py: 0.75,
                  px: 1,
                  fontSize: 16,
                  fontWeight: 650,
                },
                "& .MuiFormHelperText-root": {
                  ml: 0,
                  mt: 0.5,
                },
              }}
            />
          </Box>

          <Tooltip title="Save name">
            <IconButton
              size="small"
              onClick={onSave}
              sx={{
                mt: 0.25,
                width: 32,
                height: 32,
                borderRadius: "8px",
                color: "#FFFFFF",
                backgroundColor: "#16A34A",
                "&:hover": {
                  backgroundColor: "#15803D",
                },
              }}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Cancel">
            <IconButton
              size="small"
              onClick={onCancel}
              sx={{
                mt: 0.25,
                width: 32,
                height: 32,
                borderRadius: "8px",
                color: "#5E6670",
                backgroundColor: "#EEF0F2",
                "&:hover": {
                  backgroundColor: "#E3E6E9",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </ClickAwayListener>
    ) : (
      <Box
        component="button"
        type="button"
        onClick={onStartEditing}
        onDoubleClick={onStartEditing}
        disabled={!canEdit}
        aria-label={canEdit ? `Rename ${label}` : `Media option ${label}`}
        sx={{
          display: "block",
          width: "100%",
          padding: "3px 4px",
          border: 0,
          borderRadius: "6px",
          color: "#18212B",
          backgroundColor: "transparent",
          cursor: canEdit ? "text" : "default",
          textAlign: "left",
          transition: "background-color 160ms ease",
          "&:hover:not(:disabled)": {
            backgroundColor: "#F5F6F7",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          },
          "&:focus-visible": {
            outline: "2px solid #0074EB",
            outlineOffset: 2,
          },
        }}
      >
        <Typography
          component="span"
          sx={{
            display: "block",
            width: "100%",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            fontSize: { xs: 15, md: 17 },
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {label}
        </Typography>
      </Box>
    )}
  </Box>
);

export default EditableMediaOptionLabel;
