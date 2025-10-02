import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import ResponseList from "../ElementResponse/ResponseList";

import ElementQuestionText from "./ElementQuestionText";

const InstructionsElement = ({ qID, display }: ElementProps) => {
  return (
    <ScreenRoot>
      <CenteredStack
        display={display}
        widthOverride={display === "mobile" ? "98%" : "72%"}
        marginBottomOveride={display === "mobile" ? "32px" : "1px"}
        marginTopOveride={display === "mobile" ? "32%" : "16%"}
      >
        <ElementQuestionText display={display} />
      </CenteredStack>
      <ResponseContainer display={display}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: display === "mobile" ? "98%" : "90%",
            margin: "0 auto",
            // border: "2px solid blue",
          }}
        >
          <ResponseList
            key={qID}
            qID={qID!}
            qType="INSTRUCTIONS"
            optionText={"Instruction"}
            display={display}
          />
        </Box>
      </ResponseContainer>
    </ScreenRoot>
  );
};
export default InstructionsElement;
