import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import ResponseList from "../ElementResponse/ResponseList";

import ElementQuestionText from "./ElementQuestionText";

const InstructionsElement = ({ qID, display }: ElementProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
        minHeight: "700px",
        zIndex: 20,
        // border: "2px dashed black",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: "60%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          margin: "0 auto",
          marginTop: "24%",
          zIndex: 2,
          mb: 2,
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          minHeight: "60%",
          margin: "0 auto",
          // border: "2px solid red",
        }}
      >
        <ResponseList
          key={qID}
          qID={qID!}
          qType="INSTRUCTIONS"
          optionText={"Instruction"}
          display={display}
        />
      </Box>
    </Box>
  );
};
export default InstructionsElement;
