import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import InputResponse from "../ElementResponse/InputResponse";

import ElementImageContainer from "./ElementImageContainer";
import ElementQuestionText from "./ElementQuestionText";

const TextElement = ({ display, qImage }: ElementProps) => {
  let questionMarginTop;

  if (display === "mobile") {
    questionMarginTop = qImage ? "24%" : "52%";
  } else {
    questionMarginTop = qImage ? "-5%" : "20%";
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
            maxHeight: "360px",
            marginBottom: { xl: 1 },
            marginTop: { xl: "8%" },
          }}
        >
          <ElementImageContainer />
        </Box>
      )}
      {/* question section */}
      <ScreenRoot display={display}>
        <CenteredStack
          display={display}
          widthOverride={display === "mobile" ? "98%" : "72%"}
        >
          <ElementQuestionText display={display} />
        </CenteredStack>
        <ResponseContainer display={display}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
              width: display === "mobile" ? "98%" : "80%",
              height: "48%",
              margin: "2% auto",
            }}
          >
            <InputResponse
              inputPlaceholder={"Type your answer here..."}
              submitButtonText={"Ok"}
              display={display}
            />
          </Box>
        </ResponseContainer>
      </ScreenRoot>
    </Box>
  );
};
export default TextElement;
