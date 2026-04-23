import { Box, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import { ChevronDown } from "lucide-react";

import { useGetOptionsOfQuestionQuery } from "../../app/slices/optionApiSlice";
import { FlowFormProps } from "../../utils/types";

const FlowFormOptions = ({
  questionID,
  register,
  blockIndex,
  condition,
  setConditions,
  readOnly,
}: FlowFormProps) => {
  const { data: options } = useGetOptionsOfQuestionQuery(questionID);

  const conditionLabelMap: Record<string, string> = {
    is: "Is",
    "is-not": "Is Not",
  };

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
          width: "90%",
          borderRadius: "12px",
          bgcolor: "#f1f5f9",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* IF LABEL */}
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#64748b",
            whiteSpace: "nowrap",
          }}
        >
          If
        </Typography>

        {/* CONDITION TYPE SELECT */}
        <Box sx={{ width: "110px", flexShrink: 0 }}>
          <Select
            disabled={readOnly}
            {...register(`conditions.${blockIndex}.conditionType`)}
            defaultValue={"is"}
            IconComponent={ChevronDown}
            renderValue={(selected) => {
              const label = conditionLabelMap[selected] || "";
              return (
                <Tooltip title={label} arrow>
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
              width: "100px",
              height: "32px",
              bgcolor: "#e0e7ff",
              borderRadius: "8px",
              "& .MuiSelect-select": {
                px: 1,
                pr: "26px",
                display: "block",
                fontSize: "13px",
                overflow: "hidden",
              },
              "& fieldset": { border: "none" },
              "& .MuiSelect-icon": {
                color: "#64748b",
                right: "6px",
              },
            }}
          >
            <MenuItem value={"is"} sx={{ mx: 0.5, borderRadius: "10px" }}>
              Is
            </MenuItem>
            <MenuItem value={"is-not"} sx={{ mx: 0.5, borderRadius: "10px" }}>
              Is Not
            </MenuItem>
          </Select>
        </Box>

        {/* VALUE SELECT */}
        <Box sx={{ width: "160px", flexShrink: 0 }}>
          <Select
            disabled={readOnly}
            {...register(`conditions.${blockIndex}.conditionValue`)}
            defaultValue={
              condition.conditionValue ??
              (options && options.length > 0 ? options[0].value : "")
            }
            onChange={(e) => {
              setConditions((prev) =>
                prev.map((cond, idx) =>
                  idx === blockIndex
                    ? { ...cond, conditionValue: e.target.value }
                    : cond,
                ),
              );
            }}
            IconComponent={ChevronDown}
            renderValue={(selected) => {
              const selectedOption = options?.find(
                (opt) => opt.value === selected,
              );
              const label = selectedOption?.value || "";
              return (
                <Tooltip title={label} arrow>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                    }}
                  >
                    {/* order */}
                    <Box sx={{ flexShrink: 0 }}>{selectedOption?.order}</Box>

                    {/* text */}
                    <Box
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {label}
                    </Box>
                  </Box>
                </Tooltip>
              );
            }}
            sx={{
              width: "100px",
              height: "32px",
              bgcolor: "rgba(255,255,255,0.9)",
              borderRadius: "8px",
              "& .MuiSelect-select": {
                px: 1,
                pr: "26px",
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                overflow: "hidden",
              },
              "& fieldset": { border: "none" },
              "& .MuiSelect-icon": {
                color: "#64748b",
                right: "6px",
              },
            }}
          >
            {options?.map((option) => (
              <MenuItem
                key={option.optionID}
                value={option.value}
                sx={{ mx: 0.5, borderRadius: "10px" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  {/* order */}
                  <Box sx={{ flexShrink: 0 }}>{option.order}</Box>

                  {/* text */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {option.value}
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
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
export default FlowFormOptions;
