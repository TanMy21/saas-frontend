import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { ElementProps } from "../../../utils/types";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";

const CheckBoxElement = ({ qNO }: ElementProps) => {
  const [choices, setChoices] = useState(["Choice A"]);

  const addChoice = () => {
    if (choices.length < 26) {
      const nextCharCode = "A".charCodeAt(0) + choices.length;
      const nextChoiceLetter = String.fromCharCode(nextCharCode);
      setChoices([...choices, `Choice ${nextChoiceLetter}`]);
    }
  };

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
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "12%" }}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          mr={1}
        >
          <Typography variant="h4" fontWeight={"bold"} color={"black"}>
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
        <FormGroup>
          {choices.map((choice, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox />}
              label={choice}
            />
          ))}
        </FormGroup>
      </Box>
      <Box mt={2} mb={2}>
        {choices.length < 10 && (
          <Button
            onClick={addChoice}
            sx={{
              backgroundColor: "#0445AF",
              mr: 2,
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#0445AF",
              },
            }}
            variant="contained"
            size="small"
          >
            Add Choice &nbsp; <MdAdd fontSize={"24px"} />
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default CheckBoxElement;
