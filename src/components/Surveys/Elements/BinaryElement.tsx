import { Box, Button } from "@mui/material";

import { ElementProps } from "../../../utils/types";

import ElementQuestionText from "./ElementQuestionText";

const BinaryElement = ({
  qID,
  qNO,
  qText,
  qDescription,
  display,
  qSettings,
}: ElementProps) => {
  const widthBtn = display === "mobile" ? "80px" : "100px";
  const heightBtn = display === "mobile" ? "80px" : "100px";

  const { button1Text, button2Text } = qSettings || {
    button1Text: "Yes",
    button2Text: "No",
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      // margin={"auto"}
      width={"98%"}
      height={"100%"}
      zIndex={20}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        sx={{ width: "98%", marginTop: "12%" }}
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
        flexDirection={"row"}
        justifyContent={"center"}
        width={"90%"}
        mt={8}
      >
        <Box
          sx={{
            width: widthBtn,
            height: heightBtn,
          }}
        >
          <Button
            variant="outlined"
            size="large"
            sx={{
              marginRight: "12%",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          >
            {button1Text}
          </Button>
        </Box>
        <Box
          ml={4}
          sx={{
            width: widthBtn,
            height: heightBtn,
          }}
        >
          <Button
            variant="outlined"
            size="large"
            sx={{
              marginRight: "12%",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          >
            {button2Text}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default BinaryElement;
