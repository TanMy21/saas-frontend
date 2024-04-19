import { Box, Button, TextField, Typography } from "@mui/material";
import { ElementProps } from "../../../utils/types";
import { FaArrowRightLong } from "react-icons/fa6";
import { BiCheck } from "react-icons/bi";

const NumberElement = ({ qNO }: ElementProps) => {
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
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          mr={1}
        >
          <Typography variant="h4" fontWeight={"bold"} color={"black"} mt={1}>
            {qNO}
          </Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          mr={2}
        >
          <Typography variant="h6" mt={1}>
            <FaArrowRightLong />
          </Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            variant="h3"
            fontStyle={"italic"}
            fontFamily={
              "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
            }
          >
            Your question here.
          </Typography>
        </Box>
      </Box>
      <Box display={"flex"} flexDirection={"column"} mt={4}>
        <Box>
          <TextField
            id="standard-multiline-flexible"
            placeholder="Type your answer here..."
            variant="standard"
            sx={{
              width: "600px",
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
