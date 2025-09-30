import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import InputResponse from "../ElementResponse/InputResponse";

import ElementQuestionText from "./ElementQuestionText";

const EmailContactELement = ({ display }: ElementProps) => {
  return (
    <ScreenRoot>
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
            justifyContent: "center",
            alignItems: "center",
            width: display === "mobile" ? "98%" : "80%",
            height: "48%",
            margin: "0 auto",
            // border: "2px solid blue",
          }}
        >
          <InputResponse
            inputPlaceholder={"name@example.com"}
            submitButtonText={"Submit"}
            display={display}
          />
        </Box>
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default EmailContactELement;
