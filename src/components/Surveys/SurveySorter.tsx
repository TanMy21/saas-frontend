import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

import { useElectricTheme } from "../../theme/useElectricTheme";
import { SurveySorterProps } from "../../utils/types";

const SurveySorter = ({ sortBy, setSortBy }: SurveySorterProps) => {
  const { background, shadows } = useElectricTheme();
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
            borderColor: background.soft5,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: background.soft5,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: background.soft5,
            boxShadow: shadows[10],
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
