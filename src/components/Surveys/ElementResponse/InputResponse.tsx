import { Box, Button, TextField } from "@mui/material";

import { InputResponseProps } from "../../../utils/types";

const InputResponse = ({
  inputPlaceholder,
  submitButtonText,
}: InputResponseProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        width: "96%",
        height: "60%",
        // border: "2px solid orange",
      }}
    >
      <TextField
        id="standard-multiline-flexible"
        placeholder={inputPlaceholder}
        variant="standard"
        sx={{
          margin: "0 auto",
          width: "56%",
          "& .MuiInputBase-input": {
            whiteSpace: "noWrap",
            height: "64px",
            fontSize: "36px",
            padding: "0px 8px 0px 16px",
            lineHeight: 1,
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#A6A4B7",
            opacity: 1,
          },
          "& .MuiInput-underline:before": {
            borderBottomColor: "#E5E7EB",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#757575",
          },
          ".MuiInput-underline:hover": {
            borderBottomColor: "#E5E7EB",
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          margin: "16px auto",
          paddingRight: "4%",
          width: "60%",
          height: "25%",
          //   border: "2px solid green",
        }}
      >
        <Button
          sx={{
            borderRadius: 8,
            backgroundColor: "#434EE7",
            textTransform: "capitalize",
            padding: "8px 16px",
            fontWeight: "bold",
            width: "20%",
            "&:hover": {
              backgroundColor: "#434EE7",
            },
          }}
          variant="contained"
          size="large"
        >
          {submitButtonText}
        </Button>
      </Box>
    </Box>
  );
};

export default InputResponse;
