import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import MediaOptionsContainer from "../ElementResponse/MediaOptionsContainer";

import ElementQuestionText from "./ElementQuestionText";

const MediaElement = ({ qID, display }: ElementProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
        minHeight: "700px",
        zIndex: 20,
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: { md: "60%", xl: "50%" },
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          margin: "0 auto",
          marginTop: "8%",
          zIndex: 2,
          mb: 5,
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: { md: "36%", xl: "50%" },
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
    </Box>
  );
};
export default MediaElement;
