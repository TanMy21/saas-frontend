import { Box, Button } from "@mui/material";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";

import { RootState } from "../../../app/store";
import { ElementProps } from "../../../utils/types";

import ElementQuestionText from "./ElementQuestionText";

const WelcomeScreenElement = ({ display }: ElementProps) => {
  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const { questionPreferences } = question || {};

  const { buttonText } = questionPreferences?.uiConfig || {
    buttonText: "Next",
  };

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
          endIcon={<FaArrowRightLong fontSize={"24px"} />}
        >
          {buttonText} &nbsp;
        </Button>
      </Box>
    </Box>
  );
};

export default WelcomeScreenElement;
