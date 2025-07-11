import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import BinaryResponseContainer from "../ElementResponse/BinaryResponseContainer";

import ElementQuestionText from "./ElementQuestionText";

const BinaryElement = ({ display }: ElementProps) => {
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
          height: "48%",
          marginTop: "2% auto",
          // border: "2px solid blue",
        }}
      >
        <BinaryResponseContainer display={display} />
      </Box>
    </Box>
  );
};
export default BinaryElement;
