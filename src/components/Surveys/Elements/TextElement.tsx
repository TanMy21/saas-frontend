import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import InputResponse from "../ElementResponse/InputResponse";

import ElementImageContainer from "./ElementImageContainer";
import ElementQuestionText from "./ElementQuestionText";

const TextElement = ({ display, qImage }: ElementProps) => {
  return (
    <ScreenRoot display={display}>
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
            marginBottom: { xl: "8px" },
            marginTop: { xl: "4%" },
          }}
        >
          <ElementImageContainer />
        </Box>
      )}

      <CenteredStack
        display={display}
        widthOverride={display === "mobile" ? "98%" : "72%"}
        marginTopOveride={qImage ? "4px" : "8%"}
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
  );
};
export default TextElement;
