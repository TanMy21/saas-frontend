import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import InputResponse from "../ElementResponse/InputResponse";

import ElementImageContainer from "./ElementImageContainer";
import ElementQuestionText from "./ElementQuestionText";

const TextElement = ({ display, qImage }: ElementProps) => {
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
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: "50%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          margin: "0 auto",
          marginTop: "8%",
          marginBottom: 5,
          zIndex: 2,
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
      {qImage && <ElementImageContainer />}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          height: "48%",
          margin: "1% auto",
          // border: "2px solid blue",
        }}
      >
        <InputResponse
          inputPlaceholder={"Type your answer here..."}
          submitButtonText={"Ok"}
          display={display}
        />
      </Box>
    </Box>
  );
};
export default TextElement;
