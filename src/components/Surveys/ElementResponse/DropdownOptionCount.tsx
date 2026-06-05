import { Typography } from "@mui/material";

import {
  DROPDOWN_WARNING_COUNT,
  MAX_DROPDOWN_OPTIONS,
} from "../../../utils/constants";

export const DropdownOptionCount = ({ count }: { count: number }) => {
  const hasManyOptions = count >= DROPDOWN_WARNING_COUNT;

  return (
    <Typography
      sx={{
        fontSize: 13,
        color: hasManyOptions ? "#B45309" : "#64748B",
        textAlign: "right",
      }}
    >
      {count}/{MAX_DROPDOWN_OPTIONS} dropdown options
      {hasManyOptions
        ? " · Long dropdowns may be harder for participants to scan."
        : ""}
    </Typography>
  );
};
