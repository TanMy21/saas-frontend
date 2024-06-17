import { Box, Button, TextField } from "@mui/material";
import { ElementProps } from "../../../utils/types";
import { BiCheck } from "react-icons/bi";
import ElementQuestionText from "./ElementQuestionText";

const NumberElement = ({
  qID,
  qNO,
  qText,
  qDescription,
  display,
}: ElementProps) => {
  const marginTop = display === "mobile" ? "20%" : "8%";
  const inputContainerWidth = display === "mobile" ? "96%" : "56%";
  const marginTopBtn = display === "mobile" ? "2%" : "1%";
  const textFieldWidth = display === "mobile" ? "100%" : "100%";
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
      <Box display={"flex"} flexDirection={"row"} sx={{  width: "98%", marginTop: marginTop }}>
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
        sx={{ width: "98%", padding: "2%" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            width: inputContainerWidth,
            height: "96%",
          }}
        >
          <Box
            sx={{
              width: "96%",
              margin: textFieldMarginLeft,
              padding: "2%",
            }}
          >
            <TextField
              id="standard-multiline-flexible"
              placeholder="Type your answer here..."
              variant="standard"
              sx={{
                width: textFieldWidth,
                "& .MuiInputBase-input": {
                  whiteSpace: "noWrap",
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
                  borderBottomColor: "#BDCEEA",
                },
                "& .MuiInput-underline:after": {
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
export default NumberElement;
