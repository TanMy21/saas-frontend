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
  ({ topLabel, showPassword, onTogglePassword, sx, ...rest }, ref) => {
    return (
      <FormControl fullWidth>
        <FormLabel
          sx={{
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.2,
            color: "text.secondary",
          }}
        >
          {topLabel}
        </FormLabel>
        <TextField
          {...rest}
          label={undefined}
          sx={sx}
          margin="dense"
          inputRef={ref}
          type={
            rest.type === "password"
              ? showPassword
                ? "text"
                : "password"
              : rest.type || "text"
          }
          InputProps={{
            endAdornment: onTogglePassword && (
              <InputAdornment position="end">
                <IconButton onClick={onTogglePassword} edge="end">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    );
  },
);

LabeledField.displayName = "LabeledField";

export default LabeledField;
