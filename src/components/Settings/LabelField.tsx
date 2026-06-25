import { forwardRef } from "react";

import {
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";

type LabeledFieldProps = TextFieldProps & {
  topLabel: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
};

const LabeledField = forwardRef<HTMLInputElement, LabeledFieldProps>(
  (
    {
      topLabel,
      showPassword,
      onTogglePassword,
      sx,
      InputProps,
      type,
      helperText,
      ...rest
    },
    ref,
  ) => {
    const isPasswordField = type === "password";

    return (
      <FormControl fullWidth>
        <FormLabel
          sx={{
            mb: 0.85,
            fontSize: "0.8125rem",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "0.005em",
            color: "#334155",

            "&.Mui-focused": {
              color: "#005BC4",
            },
          }}
        >
          {topLabel}
        </FormLabel>

        <TextField
          {...rest}
          label={undefined}
          sx={sx}
          margin="none"
          inputRef={ref}
          type={
            isPasswordField
              ? showPassword
                ? "text"
                : "password"
              : type || "text"
          }
          helperText={helperText}
          InputProps={{
            ...InputProps,

            endAdornment: onTogglePassword ? (
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  edge="end"
                  size="small"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={onTogglePassword}
                  sx={{
                    mr: 0.25,
                    color: "#64748B",

                    "&:hover": {
                      color: "#005BC4",
                      backgroundColor: "rgba(0,116,235,0.07)",
                    },
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </IconButton>
              </InputAdornment>
            ) : (
              InputProps?.endAdornment
            ),
          }}
          FormHelperTextProps={{
            sx: {
              mx: 0.25,
              mt: 0.7,
              fontSize: "0.75rem",
              lineHeight: 1.4,
            },
          }}
        />
      </FormControl>
    );
  },
);

LabeledField.displayName = "LabeledField";

export default LabeledField;
