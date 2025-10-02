import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import ResponseList from "../ElementResponse/ResponseList";

import ElementQuestionText from "./ElementQuestionText";

const ChoiceElement = ({ qID, display }: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <CenteredStack
        display={display}
        widthOverride={display === "mobile" ? "98%" : "72%"}
        marginTopOveride={display === "mobile" ? "32%" : "16%"}
      >
        <ElementQuestionText display={display} />
      </CenteredStack>
      <ResponseContainer display={display}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            width: display === "mobile" ? "98%" : "80%",
            minHeight: "60%",
            margin: "2% auto",
            // border: "2px solid blue",
          }}
        >
          <ResponseList
            key={qID}
            qID={qID!}
            qType={"RADIO"}
            optionText={"Choice"}
            display={display}
          />
        </Box>
      </ResponseContainer>
    </ScreenRoot>
  );
};
export default ChoiceElement;
