import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import { TimedChoiceResponse } from "../ElementResponse/TimedChoiceResponse";
import { TimedChoiceResponseMobilePreview } from "../ElementResponse/TimedChoiceResponseMobilePreview";

import ElementQuestionText from "./ElementQuestionText";

const TimedChoiceElement = ({ qID, display, showQuestion }: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <CenteredStack display={display}>
        {showQuestion && <ElementQuestionText display={display} />}
      </CenteredStack>

      <ResponseContainer display={display}>
        {display === "mobile" ? (
          <TimedChoiceResponseMobilePreview />
        ) : (
          <TimedChoiceResponse qID={qID} display={display} />
        )}{" "}
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default TimedChoiceElement;
