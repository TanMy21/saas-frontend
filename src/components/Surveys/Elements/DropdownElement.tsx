import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import DropdownResponse from "../ElementResponse/DropdownResponse";

import ElementQuestionText from "./ElementQuestionText";

const DropdownElement = ({ qID, display, showQuestion }: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <CenteredStack display={display}>
        {showQuestion && <ElementQuestionText display={display} />}
      </CenteredStack>
      <ResponseContainer display={display}>
        <DropdownResponse qID={qID} display={display} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default DropdownElement;
