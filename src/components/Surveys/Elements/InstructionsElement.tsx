import { ElementProps } from "../../../utils/types";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";

import { InfoScreenContent } from "./InfoScreenContent";

const InstructionsElement = ({ qID, display }: ElementProps) => {
  return (
    <ScreenRoot>
      <ResponseContainer display={display}>
        <InfoScreenContent qID={qID} display={display} />
      </ResponseContainer>
    </ScreenRoot>
  );
};
export default InstructionsElement;
