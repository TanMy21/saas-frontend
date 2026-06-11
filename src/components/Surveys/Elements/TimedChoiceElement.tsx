import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import HeaderContainer from "../../screen-layout/HeaderContainer";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import { TimedChoiceResponse } from "../ElementResponse/TimedChoiceResponse";
import { TimedChoiceResponseMobilePreview } from "../ElementResponse/TimedChoiceResponseMobilePreview";

import ElementQuestionText from "./ElementQuestionText";
import { TimedChoiceTimerPreview } from "./TimedChoiceTimerPreview";

const TimedChoiceElement = ({ qID, display, showQuestion }: ElementProps) => {
  return (
    <ScreenRoot
      display={display}
      justifyContentOveride="flex-start"
      alignItemsOveride="start"
    >
      <HeaderContainer display={display} marginTopOveride="4%">
        <TimedChoiceTimerPreview />
      </HeaderContainer>

      <CenteredStack display={display} marginTopOveride="4%">
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
