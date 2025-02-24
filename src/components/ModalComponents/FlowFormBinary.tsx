import { Box, MenuItem, Select, TextField } from "@mui/material";

import { FlowFormProps } from "../../utils/types";

const FlowFormBinary = ({ condition, register, blockIndex }: FlowFormProps) => {
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
          type="text"
          size="small"
          sx={{ width: "100%", height: "100%" }}
        />
        <TextField
          {...register(`conditions.${blockIndex}.flowConditionID`)}
          defaultValue={condition.flowConditionID || ""}
          type="hidden"
        />
      </Box>
      <Box sx={{ width: "92%", height: "100%" }}>
        <Select
          {...register(`conditions.${blockIndex}.conditionValue`)}
          defaultValue={"yes"}
          sx={{ width: "100%", height: "100%" }}
        >
          <MenuItem value={"yes"}>Yes</MenuItem>
          <MenuItem value={"no"}>No</MenuItem>
        </Select>
      </Box>
    </Box>
  );
};

export default FlowFormBinary;
