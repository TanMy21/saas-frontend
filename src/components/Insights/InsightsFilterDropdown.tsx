import { Box, FormControl, MenuItem, Select } from "@mui/material";

import { InsightsFilterDropdownProps } from "../../utils/insightTypes";

export const InsightsFilterDropdown = <T extends string>({
  value,
  options,
  onChange,
  icon: Icon,
}: InsightsFilterDropdownProps<T>) => {
  return (
    <FormControl
      size="small"
      sx={{
        position: "relative",
        width: 180,
      }}
    >
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        displayEmpty
        sx={{
          height: 44,
          pl: 4.5,
          pr: 2,
          borderRadius: 2,
          fontSize: 14,
          fontWeight: 500,
          backgroundColor: "background.paper",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "divider",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
            borderWidth: 1,
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
              fontSize: 14,
              fontWeight: 500,
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {/* Left icon */}
      <Box
        sx={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "text.secondary",
          pointerEvents: "none",
        }}
      >
        <Icon size={16} />
      </Box>
    </FormControl>
  );
};
