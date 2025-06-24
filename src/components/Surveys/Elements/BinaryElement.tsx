import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import BinaryResponseContainer from "../ElementResponse/BinaryResponseContainer";

import ElementQuestionText from "./ElementQuestionText";

const BinaryElement = ({ display }: ElementProps) => {
  return (
    <Box
      sx={{
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
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          margin: "0 auto",
          marginTop: "16%",
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
          height: "48%",
          marginTop: "2%",
          // border: "2px solid blue",
        }}
      >
        <BinaryResponseContainer display={display} />
      </Box>
    </Box>
  );
};
export default BinaryElement;
