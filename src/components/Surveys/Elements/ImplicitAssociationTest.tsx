import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import { ImplicitAssociationTestResponsePreview } from "../ElementResponse/ImplicitAssociationTestResponsePreview";

import ElementQuestionText from "./ElementQuestionText";

const ImplicitAssociationTest = ({ qID, display }: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <CenteredStack display={display}>
        <ElementQuestionText display={display} />
      </CenteredStack>

      <ResponseContainer display={display}>
        <ImplicitAssociationTestResponsePreview qID={qID} display={display} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default ImplicitAssociationTest;
