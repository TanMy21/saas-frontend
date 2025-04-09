import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

import { SurveySorterProps } from "../../utils/types";

const SurveySorter = ({ sortBy, setSortBy }: SurveySorterProps) => {
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(
      event.target.value as "Date created" | "Date updated" | "Alphabetically"
    );
  };
  return (
    <FormControl sx={{ width: "80%", height: "80%" }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleSortChange}
        value={sortBy}
        sx={{
          width: "100%",
          height: "100%",
          mt: "1%",
          borderRadius: 3,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E0D4F8", // default border color
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E0D4F8", // border on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E0D4F8", // border on focus/click
            boxShadow: "0 0 0 2px rgba(117, 47, 236, 0.1)", // optional glow
          },
        }}
      >
        <MenuItem value={"Date created"}>Date created</MenuItem>
        <MenuItem value={"Date updated"}>Date updated</MenuItem>
        <MenuItem value={"Alphabetically"}>Alphabetical</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SurveySorter;
