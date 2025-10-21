import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import ResponseList from "../ElementResponse/ResponseList";

import ElementQuestionText from "./ElementQuestionText";

const ChoiceElement = ({ qID, display }: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <CenteredStack display={display}>
        <ElementQuestionText display={display} />
      </CenteredStack>
      <ResponseContainer display={display}>
        <ResponseList
          key={qID}
          qID={qID!}
          qType={"RADIO"}
          optionText={"Choice"}
          display={display}
        />
      </ResponseContainer>
    </ScreenRoot>
  );
};
export default ChoiceElement;
