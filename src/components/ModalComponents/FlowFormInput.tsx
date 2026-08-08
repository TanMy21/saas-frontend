import { useEffect, useState } from "react";

import {
  Box,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChevronDown } from "lucide-react";

import { FlowFormProps } from "../../utils/types";

const FlowFormInput = ({
  condition,
  questionType,
  register,
  watch,
  setValue,
  setConditions,
  blockIndex,
  formErrors,
  handleInteraction,
  readOnly,
}: FlowFormProps) => {
  const conditionLabel = {
    "is-equal-to": "Is Equal To",
  };
  const [isFocused, setIsFocused] = useState(false);
  const conditions = watch("conditions");
  const isRange = questionType === "RANGE";
  const hasComparisonSelect =
    questionType === "NUMBER" || questionType === "RANGE";
  const conditionTypeField = `conditions.${blockIndex}.conditionType`;
  const conditionValueField = `conditions.${blockIndex}.conditionValue`;
  const watchedRangeConditionType = isRange
    ? watch(conditionTypeField)
    : undefined;
  const watchedRangeConditionValue = isRange
    ? watch(conditionValueField)
    : undefined;

  useEffect(() => {
    if (!isRange || typeof blockIndex !== "number") return;

    setValue(
      conditionTypeField,
      condition.conditionType || "is-equal-to",
    );
    setValue(conditionValueField, condition.conditionValue ?? "");
  }, [
    blockIndex,
    condition.conditionType,
    condition.conditionValue,
    conditionTypeField,
    conditionValueField,
    isRange,
    setValue,
  ]);

  useEffect(() => {
    if (!isRange || typeof blockIndex !== "number") return;

    const conditionIndex = blockIndex - 1;
    const nextConditionType =
      watchedRangeConditionType ??
      condition.conditionType ??
      "is-equal-to";
    const nextConditionValue =
      watchedRangeConditionValue ?? condition.conditionValue ?? "";

    setConditions((prev) => {
      const currentCondition = prev[conditionIndex];

      if (
        !currentCondition ||
        (currentCondition.conditionType === nextConditionType &&
          currentCondition.conditionValue === nextConditionValue)
      ) {
        return prev;
      }

      return prev.map((current, index) =>
        index === conditionIndex
          ? {
              ...current,
              conditionType: nextConditionType,
              conditionValue: nextConditionValue,
            }
          : current,
      );
    });
  }, [
    blockIndex,
    condition.conditionType,
    condition.conditionValue,
    isRange,
    setConditions,
    watchedRangeConditionType,
    watchedRangeConditionValue,
  ]);

  if (
    typeof blockIndex === "number" &&
    conditions[blockIndex] &&
    conditions?.[blockIndex]?.flowConditionID === undefined
  ) {
    setValue(
      `conditions.${blockIndex}.flowConditionID`,
      condition.flowConditionID || "",
    );
  }

  return (
    <Box component="div"
      sx={{
        display: "flex",
        alignItems: "center",
        height: "48px",
        width: "100%",
      }}
    >
      {/* IF PILL */}
      <Box component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.8,
          height: "68%",
          width: hasComparisonSelect ? "90%" : "100%",
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

        {/* CONDITION TYPE */}
        <Box component="div"
          sx={{
            width: hasComparisonSelect ? "120px" : "100px",
            flexShrink: 0,
          }}
        >
          {hasComparisonSelect ? (
            <Select
              disabled={readOnly}
              {...register(`conditions.${blockIndex}.conditionType`)}
              {...(isRange
                ? {
                    value:
                      watchedRangeConditionType ??
                      condition.conditionType ??
                      "is-equal-to",
                  }
                : { defaultValue: "is-equal-to" })}
              IconComponent={ChevronDown}
              renderValue={(selected) => {
                const labelMap: Record<string, string> = {
                  "is-equal-to": "Is Equal to",
                  "is-less-than": "Is Less than",
                  "is-less-than-equal-to": "Is Less than Equal To",
                  "is-greater-than": "Is Greater than",
                  "is-greater-than-equal-to": "Is Greater than Equal To",
                };
                const label = labelMap[selected] || "";
                return (
                  <Tooltip title={label} placement="top" arrow>
                    <Box component="div"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {label}
                    </Box>
                  </Tooltip>
                );
              }}
              sx={{
                width: "100%",
                height: "32px",
                bgcolor: "#e0e7ff",
                borderRadius: "8px",
                "& .MuiSelect-select": {
                  px: 1,
                  pr: "26px",
                  display: "block",
                  fontSize: "14px",
                  overflow: "hidden",
                },
                "& fieldset": { border: "none" },
                "& .MuiSelect-icon": {
                  color: "#64748b",
                  right: "6px",
                },
              }}
            >
              <MenuItem
                value={"is-equal-to"}
                sx={{ mx: 0.5, borderRadius: "10px" }}
              >
                Is Equal to
              </MenuItem>
              <MenuItem
                value={"is-less-than"}
                sx={{ mx: 0.5, borderRadius: "10px" }}
              >
                Is Less than
              </MenuItem>
              <MenuItem
                value={"is-less-than-equal-to"}
                sx={{ mx: 0.5, borderRadius: "10px" }}
              >
                Is Less than Equal To
              </MenuItem>
              <MenuItem
                value={"is-greater-than"}
                sx={{ mx: 0.5, borderRadius: "10px" }}
              >
                Is Greater than
              </MenuItem>
              <MenuItem
                value={"is-greater-than-equal-to"}
                sx={{ mx: 0.5, borderRadius: "10px" }}
              >
                Is Greater than Equal To
              </MenuItem>
            </Select>
          ) : (
            <Box component="div"
              sx={{
                px: 1,
                py: "4px",
                borderRadius: "6px",
                width: "80px",
                bgcolor: "#e0e7ff",
                color: "#4338ca",
                fontSize: "16px",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {conditionLabel["is-equal-to"]}
            </Box>
          )}
        </Box>

        {/* VALUE INPUT */}
        <Box component="div"
          sx={{
            width: "100px",
            flexShrink: 0,
          }}
        >
          {questionType === "NUMBER" ? (
            <TextField
              disabled={readOnly}
              {...register(`conditions.${blockIndex}.conditionValue`, {
                validate: (value) => {
                  if (isNaN(Number(value))) return "Only enter numeric values";
                  if (!Number.isInteger(Number(value)))
                    return "Whole numbers only";
                  if (Number(value) < 0) return "Only positive numbers";
                  return true;
                },
              })}
              onFocus={handleInteraction}
              error={
                !!(
                  blockIndex !== undefined &&
                  formErrors?.conditions?.[blockIndex]?.conditionValue
                )
              }
              helperText={
                blockIndex !== undefined
                  ? String(
                      formErrors?.conditions?.[blockIndex]?.conditionValue
                        ?.message || "",
                    )
                  : ""
              }
              size="small"
              sx={{
                width: "80px",
                "& .MuiOutlinedInput-root": {
                  height: "32px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  ml: 2,
                  bgcolor: "rgba(255,255,255,0.9)",
                },
              }}
            />
          ) : (
            <Tooltip
              title={
                (isRange
                  ? watchedRangeConditionValue ?? condition.conditionValue
                  : watch(`conditions.${blockIndex}.conditionValue`)) || ""
              }
              placement="top"
              arrow
            >
              <Box component="div">
                <TextField
                  disabled={readOnly}
                  {...register(`conditions.${blockIndex}.conditionValue`)}
                  {...(isRange
                    ? {
                        value:
                          watchedRangeConditionValue ??
                          condition.conditionValue ??
                          "",
                      }
                    : {})}
                  size="small"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  sx={{
                    width: isFocused ? "180px" : "100px",
                    transition: "width 0.2s ease",

                    "& .MuiOutlinedInput-root": {
                      height: "32px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      bgcolor: "rgba(255,255,255,0.9)",
                    },

                    "& input": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </Box>
            </Tooltip>
          )}
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

export default FlowFormInput;
