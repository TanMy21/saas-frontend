import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import ResponseList from "../ElementResponse/ResponseList";

import ElementQuestionText from "./ElementQuestionText";

const ChoiceElement = ({ qID, display }: ElementProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
        zIndex: 20,
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          margin: "auto",
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          margin: "auto",
          // border: "2px solid blue",
        }}
      >
        <ResponseList qID={qID!} qType={"RADIO"} optionText={"Choice"} />
      </Box>
    </Box>
  );
};
export default ChoiceElement;
