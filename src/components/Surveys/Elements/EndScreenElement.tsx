import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ScreenRoot from "../../screen-layout/ScreenRoot";

import ElementQuestionText from "./ElementQuestionText";

const EndScreenElement = ({ display, showQuestion }: ElementProps) => {
  return (
    <ScreenRoot>
      <CenteredStack
        display={display}
        widthOverride={display === "mobile" ? "98%" : "72%"}
        marginBottomOveride={display === "mobile" ? "48%" : "24%"}
        marginTopOveride={display === "mobile" ? "32%" : "16%"}
      >
        {showQuestion && <ElementQuestionText display={display} />}
      </CenteredStack>
    </ScreenRoot>
  );
};

export default EndScreenElement;
