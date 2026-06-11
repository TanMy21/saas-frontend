import { Box, TextField, Typography } from "@mui/material";

export const ConceptFitEditableResponseBox = ({
  keyLabel,
  value,
  placeholder,
  disabled,
  onChange,
}: {
  keyLabel: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) => {
  return (
    <Box
      sx={{
        border: "1px solid #67E8F9",
        borderRadius: 2,
        bgcolor: "#FFFFFF",
        p: 1.5,
        textAlign: "center",
        minWidth: 0,
      }}
    >
      <Typography sx={{ fontSize: 16, color: "#64748B", mb: 0.5 }}>
        {keyLabel}
      </Typography>

      <TextField
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        variant="standard"
        onChange={(event) => onChange(event.target.value)}
        inputProps={{
          maxLength: 32,
        }}
        InputProps={{
          disableUnderline: true,
        }}
        sx={{
          width: "100%",
          "& .MuiInputBase-root": {
            fontSize: 15,
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1.25,
            textAlign: "center",
          },
          "& .MuiInputBase-input": {
            p: 0,
            textAlign: "center",
            cursor: disabled ? "default" : "text",
          },
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#0F172A",
          },
        }}
      />
    </Box>
  );
};
