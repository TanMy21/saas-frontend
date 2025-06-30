import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import ScaleResponse from "../ElementResponse/ScaleResponse";

import ElementQuestionText from "./ElementQuestionText";

const ScaleElement = ({ display }: ElementProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
        minHeight: "700px",
        // ...(display === "mobile" && { height: "auto" }),
        zIndex: 20,
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom:{ md: "64%", xl: "50%" },
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          marginTop: "2% auto",
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: { md: "32%", xl: "50%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          margin: "2% auto",
          ...(display === "mobile" && { height: "200px" }),
          // border: "2px solid blue",
        }}
      >
        <ScaleResponse display={display} />
      </Box>
    </Box>
  );
};
export default ScaleElement;
