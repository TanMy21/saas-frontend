import { forwardRef } from "react";

import {
  FormControl,
  FormLabel,
  TextField,
  type TextFieldProps,
} from "@mui/material";

type LabeledFieldProps = TextFieldProps & { topLabel: string };

const LabeledField = forwardRef<HTMLInputElement, LabeledFieldProps>(
  ({ topLabel, sx, ...rest }, ref) => {
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
        />
      </FormControl>
    );
  }
);

LabeledField.displayName = "LabeledField";

export default LabeledField;
