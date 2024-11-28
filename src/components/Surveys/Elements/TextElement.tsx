import { Box, Button, TextField } from "@mui/material";
import { BiCheck } from "react-icons/bi";

import { ElementProps } from "../../../utils/types";

import ElementQuestionText from "./ElementQuestionText";

const TextElement = ({
  qID,
  qNO,
  qText,
  qDescription,
  display,
}: ElementProps) => {
  const marginTop = display === "mobile" ? "20%" : "16%";
  const inputContainerWidth = display === "mobile" ? "96%" : "68%";
  const textFieldWidth = display === "mobile" ? "100%" : "96%";
  const textFieldMarginLeft = display === "mobile" ? "4%" : "0%";
  const textFieldFontSize = display === "mobile" ? "16px" : "36px";

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
      <Box
        display={"flex"}
        flexDirection={"row"}
        sx={{ width: "96%", marginTop: marginTop }}
      >
        <ElementQuestionText
          qID={qID}
          qNO={qNO}
          qText={qText}
          qDescription={qDescription}
          display={display}
        />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        mt={1}
        sx={{
          width: "98%",
          height: "40%",
          padding: "2%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            width: inputContainerWidth,
            height: "40%",
          }}
        >
          <Box
            sx={{
              width: "98%",
              margin: textFieldMarginLeft,
              padding: "2%",
            }}
          >
            <TextField
              id="standard-multiline-flexible"
              placeholder="Type your answer here..."
              multiline
              maxRows={10}
              variant="standard"
              sx={{
                width: textFieldWidth,
                "& .MuiInputBase-input": {
                  whiteSpace: "wrap",
                  height: "52px",
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
                marginTop: "2%",
                marginLeft: "16%",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#0445AF",
                },
              }}
              variant="contained"
              size="large"
              endIcon={<BiCheck />}
            >
              Ok
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default TextElement;
