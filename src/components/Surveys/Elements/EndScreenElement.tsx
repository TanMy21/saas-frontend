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
          bottom: "50%",
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
      <Box
        sx={{
          position: "absolute",
          top: "50%",
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
        <Box
          sx={{
            transformOrigin: "bottom",
            display: "flex",
            flexDirection: "column",
            // border: "2px dashed red",
          }}
        >
          <Button
            sx={{
              mt: 2,
              borderRadius: 8,
              backgroundColor: primary.dark,
              textTransform: "capitalize",
              padding: display === "mobile" ? "8px 12px" : "16px 24px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: primary.dark,
              },
            }}
            variant="contained"
            size="large"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EndScreenElement;
