import { useAppTheme } from "../../../theme/useAppTheme";
import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ScreenRoot from "../../screen-layout/ScreenRoot";

import ElementQuestionText from "./ElementQuestionText";

const EndScreenElement = ({ display }: ElementProps) => {
  const { primary } = useAppTheme();
  return (
    <ScreenRoot>
      <CenteredStack
        display={display}
        widthOverride={display === "mobile" ? "98%" : "72%"}
        marginBottomOveride={display === "mobile" ? "48%" : "24%"}
      >
        <ElementQuestionText display={display} />
      </CenteredStack>
    </ScreenRoot>
  );
};

export default EndScreenElement;
