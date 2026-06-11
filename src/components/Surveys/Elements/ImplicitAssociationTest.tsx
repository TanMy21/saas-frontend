import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import { IATMobilePreview } from "../ElementResponse/IATResposeMobilePreview";
import { ImplicitAssociationTestResponsePreview } from "../ElementResponse/ImplicitAssociationTestResponsePreview";

import ElementQuestionText from "./ElementQuestionText";

const ImplicitAssociationTest = ({
  qID,
  display,
  showQuestion,
}: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <CenteredStack display={display}>
        {showQuestion && <ElementQuestionText display={display} />}
      </CenteredStack>

      <ResponseContainer display={display}>
        {display === "mobile" ? (
          <IATMobilePreview qID={qID} display={display} />
        ) : (
          <ImplicitAssociationTestResponsePreview qID={qID} display={display} />
        )}
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default ImplicitAssociationTest;
