import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import { ConceptFitResponse } from "../ElementResponse/ConceptFitResponse";

import ElementQuestionText from "./ElementQuestionText";

export const ConceptFitElement = ({
  qID,
  display,
  showQuestion,
  qImage
}: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <CenteredStack display={display}>
        {showQuestion && <ElementQuestionText display={display} />}
      </CenteredStack>

      <ResponseContainer display={display}>
        <ConceptFitResponse qID={qID} display={display} qImage={qImage} />
      </ResponseContainer>
    </ScreenRoot>
  );
};
