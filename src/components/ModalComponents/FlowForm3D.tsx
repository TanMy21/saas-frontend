import { useEffect } from "react";

import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";

import { useLazyGetQuestionPreferencesByIDQuery } from "../../app/slices/questionPreferencesApiSlice";
import { FlowFormProps } from "../../utils/types";

export const FlowForm3D = ({
  questionID,
  condition,
  control,
  register,
  blockIndex,
  setValue,
  watch,
  setConditions,
}: FlowFormProps) => {
  const [trigger, { data }] = useLazyGetQuestionPreferencesByIDQuery();

  useEffect(() => {
    if (questionID) {
      trigger(questionID);
    }
  }, [questionID, trigger]);

  useEffect(() => {
    if (data?.uiConfig) {
      const currentFormValue = watch(`conditions.${blockIndex}.conditionValue`);
      const defaultVal = "Like";

      if (!currentFormValue) {
        setValue(`conditions.${blockIndex}.conditionValue`, defaultVal);
        setConditions((prev) =>
          prev.map((cond, idx) =>
            idx === blockIndex ? { ...cond, conditionValue: defaultVal } : cond
          )
        );
      }
    }
  }, [data, condition.conditionValue, blockIndex, setConditions]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "2%",
        width: "90%",
        height: "40px",
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
          sx={{ width: "100%", height: "92%" }}
        />
        <input
          {...register(`conditions.${blockIndex}.flowConditionID`)}
          defaultValue={condition.flowConditionID || ""}
          type="hidden"
        />
      </Box>
      <Box sx={{ width: "92%", height: "100%" }}>
        <Controller
          control={control}
          defaultValue={condition.conditionValue ?? "Like"}
          name={`conditions.${blockIndex}.conditionValue`}
          render={({ field }) => (
            <FormControl fullWidth sx={{ height: "100%" }}>
              <Select
                {...field}
                input={
                  <OutlinedInput
                    notched={false}
                    sx={{ height: "100%", padding: 0 }}
                  />
                }
                sx={{
                  width: "100%",
                  height: "100%",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    padding: "0 14px",
                  },
                  "& .MuiOutlinedInput-root": {
                    height: "100%",
                    padding: 0,
                  },
                }}
                value={field.value ?? condition.conditionValue ?? ""}
              >
                <MenuItem key={"Like"} value={"Like"}>
                  Like
                </MenuItem>
                <MenuItem key={"Dislike"} value={"Dislike"}>
                  Dislike
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>
    </Box>
  );
};
