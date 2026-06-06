import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { ChevronDown } from "lucide-react";

import { OptionType } from "../../../utils/types";

export const DropdownPreview = ({ options }: { options: OptionType[] }) => {
  return (
    <FormControl fullWidth>
      <Select
        value=""
        displayEmpty
        IconComponent={ChevronDown}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <Typography
                sx={{
                  color: "#94A3B8",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                Select an option
              </Typography>
            );
          }

          return selected;
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              borderRadius: 3,
              border: "1px solid #E2E8F0",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.14)",
              overflow: "hidden",
            },
          },
          MenuListProps: {
            sx: {
              py: 0.75,
            },
          },
        }}
        sx={{
          height: 56,
          borderRadius: 3,
          bgcolor: "#FFFFFF",
          color: "#0F172A",
          fontSize: 15,
          fontWeight: 600,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E2E8F0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#CBD5E1",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7C3AED",
            borderWidth: 2,
          },
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            py: 1.35,
            px: 1.75,
          },
          "& .MuiSelect-icon": {
            color: "#64748B",
            right: 12,
          },
        }}
      >
        <MenuItem value="" disabled>
          Select an option
        </MenuItem>

        {options.slice(0, 20).map((option) => (
          <MenuItem
            key={option.optionID}
            value={option.optionID}
            sx={{
              mx: 0.75,
              my: 0.25,
              borderRadius: 2,
              fontSize: 14,
              fontWeight: 500,
              color: "#0F172A",
              "&:hover": {
                bgcolor: "#F5F3FF",
              },
              "&.Mui-selected": {
                bgcolor: "#EDE9FE",
                color: "#5B21B6",
                fontWeight: 700,
              },
              "&.Mui-selected:hover": {
                bgcolor: "#DDD6FE",
              },
            }}
          >
            {option.text}
          </MenuItem>
        ))}

        {options.length > 20 && (
          <MenuItem
            disabled
            sx={{
              mx: 0.75,
              mt: 0.5,
              borderRadius: 2,
              fontSize: 13,
              color: "#64748B",
              bgcolor: "#F8FAFC",
            }}
          >
            + {options.length - 20} more option(s)
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};
