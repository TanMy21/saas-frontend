import { useEffect } from "react";

import { Box, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import { ChevronDown } from "lucide-react";
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
  readOnly,
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
            idx === blockIndex ? { ...cond, conditionValue: defaultVal } : cond,
          ),
        );
      }
    }
  }, [data, condition.conditionValue, blockIndex, setConditions]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "48px",
        width: "100%",
      }}
    >
      {/* IF PILL */}
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
        {/* IF LABEL */}
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#64748b",
            whiteSpace: "nowrap",
          }}
        >
          If
        </Typography>

        {/* CONDITION */}
        <Box
          sx={{
            px: 1.2,
            py: "4px",
            borderRadius: "6px",
            bgcolor: "#e0e7ff",
            color: "#4338ca",
            fontSize: "16px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            flexShrink: 0,
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
        <Box sx={{ width: "140px", flexShrink: 0 }}>
          <Controller
            control={control}
            defaultValue={condition.conditionValue ?? "Like"}
            name={`conditions.${blockIndex}.conditionValue`}
            render={({ field }) => (
              <Select
                {...field}
                disabled={readOnly}
                value={field.value ?? condition.conditionValue ?? ""}
                IconComponent={ChevronDown}
                renderValue={(selected) => (
                  <Tooltip title={selected} arrow>
                    <Box
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {selected}
                    </Box>
                  </Tooltip>
                )}
                sx={{
                  width: "100%",
                  height: "32px",
                  bgcolor: "rgba(255,255,255,0.9)",
                  borderRadius: "8px",
                  "& .MuiSelect-select": {
                    px: 1,
                    pr: "26px",
                    display: "block",
                    fontSize: "16px",
                    overflow: "hidden",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: "#64748b",
                    right: "6px",
                  },
                }}
              >
                <MenuItem value={"Like"} sx={{ mx: 0.5, borderRadius: "10px" }}>
                  Like
                </MenuItem>
                <MenuItem
                  value={"Dislike"}
                  sx={{ mx: 0.5, borderRadius: "10px" }}
                >
                  Dislike
                </MenuItem>
              </Select>
            )}
          />
        </Box>

        {/* HIDDEN FIELD */}
        <input
          {...register(`conditions.${blockIndex}.flowConditionID`)}
          defaultValue={condition.flowConditionID || ""}
          type="hidden"
        />
      </Box>
    </Box>
  );
};
