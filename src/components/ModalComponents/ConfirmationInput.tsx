import { Box, Typography } from "@mui/material";

import { ConfirmationInputProps } from "../../types/modalTypes";

import { FormField } from "./FormFields";

export const ConfirmationInput = ({
  expectedText,
  confirmationText,
  confirmationMatch,
  control,
  errors,
  touchedFields,
}: ConfirmationInputProps) => (
  <>
    <FormField
      name="confirmationText"
      control={control}
      errors={errors}
      touchedFields={touchedFields}
      placeholder={expectedText}
      rules={{ required: "Required" }}
      autoFocus
      inputProps={{
        style: { fontFamily: "monospace", fontSize: 14 },
      }}
    />

    {confirmationText !== "" && (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, ml: 1 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: confirmationMatch ? "#22c55e" : "#dc2626",
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: confirmationMatch ? "#15803d" : "#dc2626",
            fontWeight: 500,
            fontSize: 20,
          }}
        >
          {confirmationMatch ? "Matched" : "Doesn't match"}
        </Typography>
      </Box>
    )}
  </>
);
