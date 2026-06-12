import { useEffect, useState } from "react";

import { TextField } from "@mui/material";

import { IATInlineEditableTextProps } from "../../../types/surveyBuilderTypes";
import { MAX_IAT_CATEGORY_LABEL_LENGTH } from "../../../utils/constants";

export const IATInlineEditableText = ({
  value,
  canEdit,
  fontSize,
  fontWeight,
  color,
  onSave,
}: IATInlineEditableTextProps) => {
  const [localValue, setLocalValue] = useState(value);

  /**
   * Keeps the inline editor synced when uiConfig changes from the settings panel.
   */
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /**
   * Saves inline edits only when the value actually changed.
   * Empty values are ignored so the preview never loses required labels.
   */
  const handleSave = () => {
    const cleanValue = localValue.trim();

    if (!cleanValue || cleanValue === value) return;

    onSave(cleanValue);
  };

  return (
    <TextField
      variant="standard"
      disabled={!canEdit}
      value={localValue}
      onChange={(event) =>
        setLocalValue(
          event.target.value.slice(0, MAX_IAT_CATEGORY_LABEL_LENGTH),
        )
      }
      onBlur={handleSave}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSave();
        }
      }}
      InputProps={{
        disableUnderline: true,
        sx: {
          fontSize,
          fontWeight,
          color,
          textAlign: "center",
          "& input": {
            textAlign: "center",
            p: 0,
          },
        },
      }}
      sx={{
        width: "100%",
        "& .MuiInputBase-root": {
          justifyContent: "center",
        },
      }}
    />
  );
};
