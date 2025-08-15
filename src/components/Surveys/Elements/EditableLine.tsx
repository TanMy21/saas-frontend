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
