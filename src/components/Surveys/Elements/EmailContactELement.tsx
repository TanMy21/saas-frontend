import { Box, Button, TextField } from "@mui/material";
import { ElementProps } from "../../../utils/types";
import ElementQuestionText from "./ElementQuestionText";

const EmailContactELement = ({ qID, qNO, qType, display }: ElementProps) => {
  const marginLeftBtn = display === "mobile" ? "12%" : "25%";
  const marginTopBtn = display === "mobile" ? "2%" : "1%";
  const textFieldWidth = display === "mobile" ? "100%" : "76%";
  const inputWidth = display === "mobile" ? "80%" : "70%";
  const textFieldPaddingLeft = display === "mobile" ? "2%" : "24%";
  const textFieldMarginLeft = display === "mobile" ? "4%" : "0%";
  const textFieldFontSize = display === "mobile" ? "20px" : "36px";

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      width={"96%"}
      height={"100%"}
      zIndex={20}
    >
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "16%" }}>
        <ElementQuestionText
          qID={qID}
          qNO={qNO}
          qType={qType}
          qText={"Enter your email here."}
          display={display}
        />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        mt={4}
        sx={{ width: "98%", padding: "2%" }}
      >
        <Box
          sx={{
            width: inputWidth,
            marginLeft: textFieldMarginLeft,
            padding: "2%",
            paddingLeft: textFieldPaddingLeft,
          }}
        >
          <TextField
            id="standard-multiline-flexible"
            placeholder="name@example.com"
            variant="standard"
            sx={{
              width: textFieldWidth,
              "& .MuiInputBase-input": {
                whiteSpace: "noWrap",
                height: "50px",
                fontSize: textFieldFontSize,
                padding: "0px 8px 0px",
                lineHeight: 1,
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#BDCEEA",
                opacity: 1,
              },
              "& .MuiInput-underline:before": {
                borderBottomColor: "blue",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "blue",
              },
              ".MuiInput-underline:hover": {
                borderBottomColor: "blue",
              },
            }}
          />
        </Box>
        <Box>
          <Button
            sx={{
              backgroundColor: "#0445AF",
              marginTop: marginTopBtn,
              marginLeft: marginLeftBtn,
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#0445AF",
              },
            }}
            variant="contained"
            size="large"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailContactELement;
