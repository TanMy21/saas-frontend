import { Box, Button, TextField } from "@mui/material";
import { ElementProps } from "../../../utils/types";
import { BiCheck } from "react-icons/bi";
import ElementQuestionText from "./ElementQuestionText";

const NumberElement = ({qID, qNO, qText }: ElementProps) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      width={"70%"}
      height={"100%"}
      zIndex={20}
    >
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "16%" }}>
        <ElementQuestionText qID={qID} qNO={qNO} qText={qText} />
      </Box>
      <Box display={"flex"} flexDirection={"column"} mt={4}>
        <Box>
          <TextField
            id="standard-multiline-flexible"
            placeholder="Type your answer here..."
            variant="standard"
            sx={{
              width: "clamp(300px, 100%, 600px)",
              "& .MuiInputBase-input": {
                height: "4rem",
                fontSize: "2rem",
                padding: "4px",
                lineHeight: "normal",
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
              marginTop: "2%",
              marginLeft: "1%",
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
export default NumberElement;
