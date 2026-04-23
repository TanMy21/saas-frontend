import { useEffect } from "react";

import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { ChevronDown } from "lucide-react";
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
  readOnly,
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
            idx === blockIndex ? { ...cond, conditionValue: defaultVal } : cond,
          ),
        );
      }
    }
  }, [
    data,
    condition.conditionValue,
    blockIndex,
    watch,
    setValue,
    setConditions,
  ]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "48px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.8,
          height: "68%",
          width: "100%",
          borderRadius: "12px",
          bgcolor: "#f1f5f9",
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#64748b",
          }}
        >
          If
        </Typography>

        {/* CONDITION */}
        <Box
          sx={{
            px: 1,
            py: "2px",
            borderRadius: "6px",
            bgcolor: "#e0e7ff",
            color: "#4338ca",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          is
        </Box>

        <input
          {...register(`conditions.${blockIndex}.conditionType`)}
          value="is"
          type="hidden"
        />

        {/* VALUE SELECT */}
        <Controller
          control={control}
          defaultValue={condition.conditionValue ?? ""}
          name={`conditions.${blockIndex}.conditionValue`}
          render={({ field }) => (
            <FormControl>
              <Select
                {...field}
                disabled={readOnly}
                value={field.value ?? condition.conditionValue ?? ""}
                IconComponent={ChevronDown}
                sx={{
                  minWidth: "180px",
                  height: "32px",
                  bgcolor: "#ebebeb",
                  borderRadius: "8px",
                  "& .MuiSelect-select": {
                    fontSize: "18px",
                    fontWeight: 500,
                    px: 1,
                    display: "flex",
                    alignItems: "center",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: "#64748b",
                  },
                }}
              >
                {binaryOptions.map((opt) => (
                  <MenuItem
                    key={opt.value}
                    value={opt.value}
                    sx={{ mx: 0.5, borderRadius: "10px" }}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>

      {/* HIDDEN */}
      <input
        {...register(`conditions.${blockIndex}.flowConditionID`)}
        defaultValue={condition.flowConditionID || ""}
        type="hidden"
      />
    </Box>
  );
};
export default FlowFormBinary;
