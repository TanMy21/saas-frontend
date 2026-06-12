import { InputAdornment, TextField } from "@mui/material";

import { IATSettingsTextFieldProps } from "../../../../types/surveyBuilderTypes";
import { MAX_IAT_CATEGORY_LABEL_LENGTH } from "../../../../utils/constants";

export const IATSettingsTextField = ({
  label,
  value,
  disabled,
  onChange,
}: IATSettingsTextFieldProps) => {
  return (
    <TextField
      fullWidth
      variant="standard"
      disabled={disabled}
      label={label}
      value={value ?? ""}
      onChange={(event) =>
        onChange(event.target.value.slice(0, MAX_IAT_CATEGORY_LABEL_LENGTH))
      }
      InputLabelProps={{
        shrink: true,
        sx: {
          mb: 0.5,
          fontSize: 13,
          fontWeight: 700,
          color: "#64748B",
        },
      }}
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <InputAdornment position="end">
            {(value ?? "").length}/{MAX_IAT_CATEGORY_LABEL_LENGTH}
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiInputLabel-root": {
          position: "relative",
          transform: "none",
          mb: 0.75,
        },
        "& .MuiInputBase-root": {
          mt: 0.75,
          borderRadius: "8px",
          height: "42px",
          fontSize: "15px",
          backgroundColor: "#F3F4F6",
          color: "#1F2937",
          px: 1.5,
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: disabled ? "#F3F4F6" : "#E5E7EB",
          },
          "&.Mui-focused": {
            backgroundColor: "#FFF7ED",
          },
        },
        "& .MuiInputBase-input": {
          lineHeight: "1.5",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: disabled ? "not-allowed" : "text",
          fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
          fontWeight: 500,
        },
      }}
    />
  );
};
