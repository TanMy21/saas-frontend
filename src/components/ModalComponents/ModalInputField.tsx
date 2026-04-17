import { TextField, type TextFieldProps } from "@mui/material";

const ModalInputField = (props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      fullWidth
      sx={{
        mb: 2,
        border: "1px solid #d1d6e0",
        borderRadius: 2,
        "& .MuiInputBase-root": {
          bgcolor: "rgba(249,250,251,0.5)",
          borderRadius: 2,
          transition: "all 0.2s",
          "&:hover": { bgcolor: "#fff" },
          "&.Mui-focused": {
            bgcolor: "#fff",
            boxShadow: "0 0 0 2px #2563eb22",
          },
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "grey.200",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "grey.300",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "primary.main",
          borderWidth: 2,
        },
        mt: 0.5,
        // override from props
        ...props.sx,
      }}
    />
  );
};

export default ModalInputField;
