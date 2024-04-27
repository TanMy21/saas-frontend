import { Box, Button, TextField } from "@mui/material";
import { ElementProps } from "../../../utils/types";
import { BiCheck } from "react-icons/bi";
import ElementQuestionText from "./ElementQuestionText";

const TextElement = ({ qID, qNO, qText, display }: ElementProps) => {
  const marginLeftBtn = display === "mobile" ? "12%" : "25%";
  const marginTopBtn = display === "mobile" ? "2%" : "1%";
  const textFieldWidth = display === "mobile" ? "100%" : "80%";
  const textFieldPaddingLeft = display === "mobile" ? "2%" : "24%";
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
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "16%" }}>
        <ElementQuestionText
          qID={qID}
          qNO={qNO}
          qText={qText}
          display={display}
        />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        mt={4}
        sx={{ width: "90%" }}
      >
        <Box
          sx={{
            width: "80%",
            margin: "auto",
            padding: "2%",
            paddingLeft: textFieldPaddingLeft,
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
                whiteSpace: "noWrap",
                height: "5rem",
                fontSize: textFieldFontSize,
                padding: "8px",
                lineHeight: "normal",
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
            endIcon={<BiCheck />}
          >
            Ok
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default TextElement;
