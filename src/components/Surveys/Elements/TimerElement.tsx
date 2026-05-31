import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import { TimedChoiceResponse } from "../ElementResponse/TimedChoiceResponse";

import ElementQuestionText from "./ElementQuestionText";

const TimedChoiceElement = ({ qID, display }: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <CenteredStack display={display}>
        <ElementQuestionText display={display} />
      </CenteredStack>

      <ResponseContainer display={display}>
        <TimedChoiceResponse qID={qID} display={display} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default TimedChoiceElement;
