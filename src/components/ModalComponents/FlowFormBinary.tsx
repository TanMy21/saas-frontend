import { useEffect } from "react";

import { Box, MenuItem, Select, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

import { useLazyGetQuestionPreferencesByIDQuery } from "../../app/slices/questionPreferencesApiSlice";
import { FlowFormProps } from "../../utils/types";

const FlowFormBinary = ({
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

  const binaryOptions = data?.uiConfig
    ? [
        {
          label: data.uiConfig.buttonTextYes,
          value: data.uiConfig.buttonTextYes,
        },
        {
          label: data.uiConfig.buttonTextNo,
          value: data.uiConfig.buttonTextNo,
        },
      ]
    : [];
  useEffect(() => {
    if (data?.uiConfig) {
      const currentFormValue = watch(`conditions.${blockIndex}.conditionValue`);
      const defaultVal = data.uiConfig.buttonTextYes ?? "Yes";

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
          defaultValue={condition.conditionValue ?? ""}
          name={`conditions.${blockIndex}.conditionValue`}
          render={({ field }) => (
            <Select
              {...field}
              sx={{ width: "100%", height: "100%" }}
              value={field.value ?? condition.conditionValue ?? ""}
            >
              {binaryOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Box>
    </Box>
  );
};

export default FlowFormBinary;
