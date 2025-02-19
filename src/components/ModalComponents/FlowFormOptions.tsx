import { Box, MenuItem, Select } from "@mui/material";

import { useGetOptionsOfQuestionQuery } from "../../app/slices/optionApiSlice";
import { FlowFormProps } from "../../utils/types";

const FlowFormOptions = ({
  questionID,
  register,
  blockIndex,
  condition,
  setConditions,
}: FlowFormProps) => {
  const { data: options } = useGetOptionsOfQuestionQuery(questionID);
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
      <Box sx={{ width: "16%", height: "96%" }}>
        <Select
          {...register(`conditions.${blockIndex}.conditionType`)}
          defaultValue={"is"}
          sx={{ width: "100%", height: "96%" }}
        >
          <MenuItem value={"is"}>Is</MenuItem>
          <MenuItem value={"is-not"}>Is Not</MenuItem>
        </Select>
      </Box>
      <Box sx={{ width: "80%", height: "96%" }}>
        <Select
          {...register(`conditions.${blockIndex}.conditionValue`)}
          defaultValue={
            condition.conditionValue ||
            (options && options?.length > 0 ? options[0].value : "")
          }
          onChange={(e) => {
            setConditions((prev) =>
              prev.map((cond, idx) =>
                idx === blockIndex
                  ? { ...cond, conditionValue: e.target.value }
                  : cond
              )
            );
          }}
          sx={{ width: "100%", height: "96%" }}
        >
          {options?.map((option) => (
            <MenuItem key={option.optionID} value={option.value}>
              <Box sx={{ display: "flex", flexDirection: "row", gap: "4%" }}>
                <Box>{option.order}</Box>
                <Box>{option.value}</Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default FlowFormOptions;
