import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import BinaryResponseContainer from "../ElementResponse/BinaryResponseContainer";

import ElementQuestionText from "./ElementQuestionText";

const BinaryElement = ({ display }: ElementProps) => {
  return (
    <ScreenRoot>
      <CenteredStack display={display}  marginTopOveride={display === "mobile" ? "32%" : "16%"}>
        <ElementQuestionText display={display} />
      </CenteredStack>
      <ResponseContainer display={display}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: display === "mobile" ? "98%" : "80%",
            height: "48%",
            margin: "2% auto",
            // border: "2px solid blue",
          }}
        >
          <BinaryResponseContainer display={display} />
        </Box>
      </ResponseContainer>
    </ScreenRoot>
  );
};
export default BinaryElement;
