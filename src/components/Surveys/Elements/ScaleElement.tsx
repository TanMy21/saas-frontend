import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import ScaleResponse from "../ElementResponse/ScaleResponse";

import ElementQuestionText from "./ElementQuestionText";

const ScaleElement = ({ display }: ElementProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
        ...(display === "mobile" && { height: "auto" }),
        zIndex: 20,
        border: "2px solid red",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          marginTop: "2%",
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
      <Box
        sx={{
          transform: display === "mobile" ? "rotate(-90deg)" : "none",
          transformOrigin: "center",
          // width: window.innerWidth < 600 ? `${containerWidth}px` : "100%",
          // height: window.innerWidth < 600 ? `${containerWidth}px` : "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          margin: "2% auto",
          border: "2px solid blue",
        }}
      >
        <ScaleResponse display={display} />
      </Box>
    </Box>
  );
};
export default ScaleElement;
