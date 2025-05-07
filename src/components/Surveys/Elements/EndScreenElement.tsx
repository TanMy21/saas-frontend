import { Box, Button } from "@mui/material";

import { ElementProps } from "../../../utils/types";

import ElementQuestionText from "./ElementQuestionText";

const EndScreenElement = ({
  qID,
  qText,
  qType,
  qDescription,
  display,
}: ElementProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
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
          zIndex: 2,
          mb: 5,
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText
          qID={qID}
          qText={qText}
          qType={qType}
          qDescription={qDescription}
          display={display}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          height: "60%",
          margin: "auto",
          // border: "2px solid blue",
        }}
      >
        <Button
          sx={{
            mt: 2,
            borderRadius: 8,
            backgroundColor: "#434EE7",
            textTransform: "capitalize",
            padding: "16px 24px",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#434EE7",
            },
          }}
          variant="contained"
          size="large"
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default EndScreenElement;
