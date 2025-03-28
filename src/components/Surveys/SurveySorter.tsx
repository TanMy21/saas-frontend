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
    <FormControl sx={{ width: "28%", height: "100%" }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleSortChange}
        value={sortBy}
        sx={{ width: "100%", height: "100%", mt: "1%" }}
      >
        <MenuItem value={"Date created"}>Date created</MenuItem>
        <MenuItem value={"Date updated"}>Date updated</MenuItem>
        <MenuItem value={"Alphabetically"}>Alphabetical</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SurveySorter;
