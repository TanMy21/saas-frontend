import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";

import ElementQuestionText from "./ElementQuestionText";

const BinaryElement = ({ display }: ElementProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
        height: "68vh",
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
          height: "48%",
          margin: "auto",
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
          margin: "auto",
          // border: "2px solid blue",
        }}
      >
        {/* Choices */}
      </Box>
    </Box>
  );
};
export default BinaryElement;
