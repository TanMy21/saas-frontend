import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { SurveySorterProps } from "../../utils/types";

const SurveySorter = ({ sortBy, setSortBy }: SurveySorterProps) => {
  const { primary } = useAppTheme();
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(
      event.target.value as "Date created" | "Date updated" | "Alphabetically"
    );
  };
  return (
    <FormControl sx={{ width: { lg: "98%", xl: "80%" }, height: "80%" }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleSortChange}
        IconComponent={ExpandMoreIcon}
        value={sortBy}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 0.5,
              borderRadius: 2,
              boxShadow: "0px 8px 24px rgba(2,43,103,0.12)",
              overflow: "hidden",
            },
          },
          MenuListProps: { dense: true },
        }}
        sx={{
          width: "100%",
          height: "100%",
          mt: "1%",
          borderRadius: 9999,
          bgcolor: "rgba(2,43,103,0.03)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0.08)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0.14)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "&.Mui-focused": {
            boxShadow: `0 0 0 2px ${primary.main} 33`,
            bgcolor: "rgba(2,43,103,0.04)",
          },
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            fontWeight: 500,
          },
        }}
      >
        <MenuItem value={"Date created"}>Date created</MenuItem>
        <MenuItem value={"Date updated"}>Date updated</MenuItem>
        <MenuItem value={"Alphabetically"}>A-Z</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SurveySorter;
