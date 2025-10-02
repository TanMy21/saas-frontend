import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import InputResponse from "../ElementResponse/InputResponse";

import ElementQuestionText from "./ElementQuestionText";

const NumberElement = ({ display }: ElementProps) => {
  return (
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
  );
};
export default NumberElement;
