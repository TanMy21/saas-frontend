import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import InputResponse from "../ElementResponse/InputResponse";

import ElementImageContainer from "./ElementImageContainer";
import ElementQuestionText from "./ElementQuestionText";

const TextElement = ({ display, qImage }: ElementProps) => {
  let questionMarginTop;

  if (display === "mobile") {
    questionMarginTop = qImage ? "24%" : "52%";
  } else {
    questionMarginTop = qImage ? "8%" : "20%";
  }
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        margin: "auto",
        width: "98%",
        minHeight: "700px",
        zIndex: 20,
        gap: 2,
      }}
    >
      {/* question section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "flex-start",
          alignItems: "center",
          px: 2,
          minHeight: "30%",
          overflow: "visible",
          width: "100%",
          margin: "0% auto",
          marginTop: questionMarginTop,
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
      {/* Image container */}
      {qImage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            px: 2,
            py: 1,
            maxHeight: "280px",
            marginBottom: { xl: 3 },
          }}
        >
          <ElementImageContainer />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          px: 2,
          minHeight: "30%",
          overflow: "visible",
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
