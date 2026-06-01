import { ElementProps } from "../../../utils/types";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";

import { InfoScreenContent } from "./InfoScreenContent";

const InfoScreenElement = ({ qID, display }: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <ResponseContainer display={display}>
        <InfoScreenContent qID={qID} display={display} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default InfoScreenElement;
