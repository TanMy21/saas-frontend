import { MenuItem, TextField } from "@mui/material";

import { OptionType } from "../../../utils/types";

export const DropdownPreview = ({ options }: { options: OptionType[] }) => {
  return (
    <TextField
      select
      fullWidth
      value=""
      variant="outlined"
      SelectProps={{
        displayEmpty: true,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          bgcolor: "#FFFFFF",
        },
      }}
    >
      <MenuItem value="" disabled>
        Select an option
      </MenuItem>

      {options.slice(0, 20).map((option) => (
        <MenuItem key={option.optionID} value={option.optionID}>
          {option.text}
        </MenuItem>
      ))}

      {options.length > 20 && (
        <MenuItem disabled>+ {options.length - 20} more option(s)</MenuItem>
      )}
    </TextField>
  );
};
