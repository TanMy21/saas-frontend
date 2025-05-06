import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import ResponseList from "../ElementResponse/ResponseList";

import ElementQuestionText from "./ElementQuestionText";

const InstructionsElement = ({ qID, display }: ElementProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
        minHeight: "72vh",
        height: "auto",
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
          height: "20%",
          margin: "0 auto",
          marginTop: "12%",
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
          height: "60%",
          margin: "auto",
          // border: "2px solid blue",
        }}
      >
        <ResponseList
          key={qID}
          qID={qID!}
          qType="INSTRUCTIONS"
          optionText={"Instruction"}
        />
      </Box>
    </Box>
  );
};
export default InstructionsElement;
