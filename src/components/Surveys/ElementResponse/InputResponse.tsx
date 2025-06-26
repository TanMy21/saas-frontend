import { Box, Button, TextField } from "@mui/material";

import { useAppTheme } from "../../../theme/useAppTheme";
import { InputResponseProps } from "../../../utils/types";

const InputResponse = ({
  inputPlaceholder,
  submitButtonText,
  display,
}: InputResponseProps) => {
  const { primary } = useAppTheme();
  return (
    <Box
      sx={{
        transformOrigin: "bottom",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        border: "2px dashed red",
      }}
    >
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
            width: display === "mobile" ? "92%" : "56%",
            "& .MuiInputBase-input": {
              whiteSpace: "noWrap",
              height: "64px",
              fontSize: display === "mobile" ? "24px" : "36px",
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
            width: display === "mobile" ? "96%" : "60%",
            height: "25%",
            // border: "2px solid green",
          }}
        >
          <Button
            sx={{
              borderRadius: 8,
              backgroundColor: primary.dark,
              textTransform: "capitalize",
              padding: "8px 16px",
              fontWeight: "bold",
              width: display === "mobile" ? "120px" : "20%",
              ...(display === "mobile" && { ml: "96%" }),
              "&:hover": {
                backgroundColor: primary.dark,
              },
            }}
            variant="contained"
            size="large"
          >
            {submitButtonText}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InputResponse;
