import { Box, MenuItem, Select, TextField } from "@mui/material";

import { FlowFormProps } from "../../utils/types";

const FlowFormInput = ({
  questionType,
  register,
  blockIndex,
  formErrors,
  handleInteraction,
}: FlowFormProps) => {
  const conditionLabel = {
    "is-equal-to": "Is Equal To",
  };

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
      <Box sx={{ width: "50%", height: "96%" }}>
        {questionType === "NUMBER" ? (
          <>
            <Select
              {...register(`conditions.${blockIndex}.conditionType`)}
              defaultValue={"is-equal-to"}
              sx={{ width: "100%", height: "40px" }}
            >
              <MenuItem value={"is-equal-to"}>Is Equal to</MenuItem>
              <MenuItem value={"is-less-than"}>Is Less than</MenuItem>
              <MenuItem value={"is-less-than-equal-to"}>
                Is Less than Equal To
              </MenuItem>
              <MenuItem value={"is-greater-than"}>Is Greater than</MenuItem>
              <MenuItem value={"is-greater-than-equal-to"}>
                Is Greater than Equal To
              </MenuItem>
            </Select>
          </>
        ) : (
          <Box sx={{ width: "100%", height: "96%" }}>
            <TextField
              {...register(`conditions.${blockIndex}.conditionType`)}
              defaultValue={conditionLabel["is-equal-to"]}
              InputProps={{
                readOnly: true,
              }}
              type="text"
              size="small"
              sx={{ width: "100%", height: "100%" }}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ width: "92%", height: "60%" }}>
        {questionType === "NUMBER" ? (
          <TextField
            {...register(`conditions.${blockIndex}.conditionValue`, {
              validate: (value) => {
                if (isNaN(Number(value))) return "Only enter numeric values";
                if (!Number.isInteger(Number(value)))
                  return "Please enter a whole number—decimals and fractions are not supported.";
                if (Number(value) < 0)
                  return "Only positive numbers are allowed";
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
                      ?.message || ""
                  )
                : ""
            }
            type="text"
            size="small"
            sx={{ width: "96%", height: "16px" }}
          />
        ) : (
          <TextField
            {...register(`conditions.${blockIndex}.conditionValue`)}
            type="text"
            size="small"
            sx={{ width: "96%", height: "16px" }}
          />
        )}
      </Box>
    </Box>
  );
};

export default FlowFormInput;
