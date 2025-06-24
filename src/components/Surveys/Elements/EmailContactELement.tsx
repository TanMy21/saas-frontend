import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import InputResponse from "../ElementResponse/InputResponse";

import ElementQuestionText from "./ElementQuestionText";

const EmailContactELement = ({ display }: ElementProps) => {
  const placeholderText = "name@example.com";
  const submitButtonText = "Submit";

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
          marginBottom: 5,
          zIndex: 2,
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
          margin: "0 auto",
          // border: "2px solid blue",
        }}
      >
        <InputResponse
          inputPlaceholder={placeholderText}
          submitButtonText={submitButtonText}
          display={display}
        />
      </Box>
    </Box>
  );
};

export default EmailContactELement;
