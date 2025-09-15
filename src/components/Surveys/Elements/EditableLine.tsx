import { useEffect, useRef } from "react";

import { Box, TextField, Typography } from "@mui/material";

import { EditableLineProps } from "../../../utils/types";
import { normalize } from "../../../utils/utils";

export function EditableLine({
  active,
  value,
  placeholder,
  onStartEdit,
  onChange,
  onKeyDown,
  textFieldId,
  typographySx,
  textFieldSx,
  cursorWhenActive = "text",
}: EditableLineProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // NEW: when we switch into "active" (input) mode, focus and select ALL text
  useEffect(() => {
    if (!active || !inputRef.current) return;
    // Defer to next paint to ensure the input is in the DOM
    const rAF = requestAnimationFrame(() => {
      const el = inputRef.current!;
      // preventScroll keeps viewport stable
      el.focus({ preventScroll: true });
      // select the whole value
      el.setSelectionRange(0, el.value.length);
    });
    return () => cancelAnimationFrame(rAF);
  }, [active]);

  return (
    <Box
      onClick={!active ? onStartEdit : undefined}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: active ? cursorWhenActive : "text",
      }}
    >
      {active ? (
        <TextField
          autoFocus
          id={textFieldId}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onClick={(e) => e.stopPropagation()}
          inputRef={inputRef}
          // NEW: also select-all on any focus gained by mouse/tab (fallback)
          inputProps={{
            onFocus: (e) => {
              const el = e.currentTarget;
              // guard: only select if not already selected
              if (el.selectionStart === el.selectionEnd) {
                el.setSelectionRange(0, el.value.length);
              }
            },
          }}
          sx={textFieldSx}
        />
      ) : (
        <Typography sx={typographySx}>
          {normalize(value) === "" ? placeholder : value}
        </Typography>
      )}
    </Box>
  );
}
