import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import ScaleResponse from "../ElementResponse/ScaleResponse";

import ElementQuestionText from "./ElementQuestionText";

const ScaleElement = ({ display }: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <CenteredStack display={display} widthOverride={display === "mobile" ? "98%" : "72%"}>
        <ElementQuestionText display={display} />
      </CenteredStack>
      <ResponseContainer display={display}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            width: "80%",
            margin: "2% auto",
            ...(display === "mobile" && { height: "200px" }),
            // border: "2px solid blue",
          }}
        >
          <ScaleResponse display={display} />
        </Box>
      </ResponseContainer>
    </ScreenRoot>
  );
};
export default ScaleElement;
