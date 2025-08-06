import { Box, Button } from "@mui/material";

import { useAppTheme } from "../../../theme/useAppTheme";
import { ElementProps } from "../../../utils/types";

import ElementQuestionText from "./ElementQuestionText";

const EndScreenElement = ({ display }: ElementProps) => {
  const { primary } = useAppTheme();
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        minHeight: "700px",
        width: "98%",
        zIndex: 20,
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: { md: "56%", xl: "50%" },
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          margin: "8% auto",
          zIndex: 2,
          mb: 5,
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
    </Box>
  );
};

export default EndScreenElement;
