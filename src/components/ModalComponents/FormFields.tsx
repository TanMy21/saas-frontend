import { Controller } from "react-hook-form";

import { FieldConfig } from "../../types/modalTypes";

import ModalInputField from "./ModalInputField";

export const FormField = ({
  name,
  control,
  rules,
  errors,
  touchedFields,
  placeholder,
  multiline,
  rows,
  type = "text",
  ...rest
}: FieldConfig) => {
  const hasError = !!errors[name] && !!touchedFields[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <ModalInputField
          {...field}
          // UI
          placeholder={placeholder}
          multiline={multiline}
          rows={rows}
          type={type}
          // error handling
          error={hasError}
          helperText={touchedFields[name] ? errors[name]?.message : ""}
          // custom props
          {...rest}
        />
      )}
    />
  );
};
