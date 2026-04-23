import { useState } from "react";

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
          width: questionType === "NUMBER" ? "90%" : "100%",
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
        <Box
          sx={{
            width: questionType === "NUMBER" ? "120px" : "100px",
            flexShrink: 0,
          }}
        >
          {questionType === "NUMBER" ? (
            <Select
              disabled={readOnly}
              {...register(`conditions.${blockIndex}.conditionType`)}
              defaultValue={"is-equal-to"}
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
                    <Box
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
            <Box
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
        <Box
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
              title={watch(`conditions.${blockIndex}.conditionValue`) || ""}
              placement="top"
              arrow
            >
              <Box>
                <TextField
                  disabled={readOnly}
                  {...register(`conditions.${blockIndex}.conditionValue`)}
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
