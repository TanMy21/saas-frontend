import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";
import MediaOptionsContainer from "../ElementResponse/MediaOptionsContainer";

import ElementQuestionText from "./ElementQuestionText";

const MediaElement = ({ qID, display }: ElementProps) => {
  return (
    <ScreenRoot display={display}>
      <CenteredStack
        display={display}
        widthOverride={display === "mobile" ? "98%" : "72%"}
        marginTopOveride={display === "mobile" ? "4%" : "16%"}
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
            width: "100%",
            margin: "auto",
            // border: "2px solid blue",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              transformOrigin: "bottom",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              // border: "2px dashed red",
            }}
          >
            <MediaOptionsContainer qID={qID!} display={display} />
          </Box>
        </Box>
      </ResponseContainer>
    </ScreenRoot>
  );
};
export default MediaElement;
