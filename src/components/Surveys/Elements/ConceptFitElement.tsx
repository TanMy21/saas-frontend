import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import HeaderContainer from "../../screen-layout/HeaderContainer";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import { ConceptFitResponse } from "../ElementResponse/ConceptFitResponse";
import { ConceptFitResponseMobilePreview } from "../ElementResponse/ConceptFitResponseMobilePreview";

import ElementQuestionText from "./ElementQuestionText";
import { TimedChoiceTimerPreview } from "./TimedChoiceTimerPreview";

export const ConceptFitElement = ({
  qID,
  display,
  showQuestion,
  questionImages,
}: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <HeaderContainer display={display} marginTopOveride="4%">
        <TimedChoiceTimerPreview />
      </HeaderContainer>

      <CenteredStack display={display}>
        {showQuestion && <ElementQuestionText display={display} />}
      </CenteredStack>

      <ResponseContainer display={display}>
        {display === "mobile" ? (
          <ConceptFitResponseMobilePreview />
        ) : (
          <ConceptFitResponse
            qID={qID}
            display={display}
            questionImages={questionImages}
          />
        )}
      </ResponseContainer>
    </ScreenRoot>
  );
};
