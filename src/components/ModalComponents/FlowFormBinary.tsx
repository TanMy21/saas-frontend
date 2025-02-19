import { Box, MenuItem, Select, TextField } from "@mui/material";

import { FlowFormProps } from "../../utils/types";

const FlowFormBinary = ({
  register,
  blockIndex,
  // handleInteraction,
}: FlowFormProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "2%",
        width: "90%",
        maxHeight: "40px",
      }}
    >
      <Box sx={{ width: "24%", height: "96%" }}>
        <TextField
          {...register(`conditions.${blockIndex}.conditionType`)}
          defaultValue={"is"}
          InputProps={{
            readOnly: true,
          }}
          // onFocus={handleInteraction}
          type="text"
          size="small"
          sx={{ width: "100%", height: "100%" }}
        />
      </Box>
      <Box sx={{ width: "92%", height: "96%" }}>
        <Select
          {...register(`conditions.${blockIndex}.conditionValue`)}
          defaultValue={"yes"}
          // onFocus={handleInteraction}
          sx={{ width: "100%", height: "96%" }}
        >
          <MenuItem value={"yes"}>Yes</MenuItem>
          <MenuItem value={"no"}>No</MenuItem>
        </Select>
      </Box>
    </Box>
  );
};

export default FlowFormBinary;
