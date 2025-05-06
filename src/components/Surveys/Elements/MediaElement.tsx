import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import MediaOptionsContainer from "../ElementResponse/MediaOptionsContainer";

import ElementQuestionText from "./ElementQuestionText";

const MediaElement = ({ qID, display }: ElementProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
        paddingTop: "160px",
        zIndex: 20,
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          margin: "auto",
          zIndex: 2,
          mb: 5,
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          margin: "auto",
          border: "2px solid blue",
          zIndex: 1,
        }}
      >
        <MediaOptionsContainer qID={qID!} />
      </Box>
    </Box>
  );
};
export default MediaElement;
