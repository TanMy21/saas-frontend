import { Box, Button } from "@mui/material";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";

import { RootState } from "../../../app/store";
import { useAppTheme } from "../../../theme/useAppTheme";
import { ElementProps } from "../../../utils/types";

import ElementQuestionText from "./ElementQuestionText";

const WelcomeScreenElement = ({ display }: ElementProps) => {
  const { primary } = useAppTheme();
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
        position: "relative",
        display: "flex",
        flexDirection: "column",
        margin: display === "mobile" ? "36% auto" : "0 auto",
        width: display === "mobile" ? "92%" : "98%",
        zIndex: 20,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: "60%",
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
          height: "60%",
          margin: "auto",
          // border: "2px solid blue",
        }}
      >
        <Box
          sx={{
            transformOrigin: "bottom",
            display: "flex",
            flexDirection: "column",
            // width: "100%",
            border: "2px dashed red",
          }}
        >
          <Button
            sx={{
              borderRadius: 8,
              backgroundColor: primary.dark,
              textTransform: "unset",
              padding: "16px 24px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: primary.dark,
              },
            }}
            variant="contained"
            size="large"
            endIcon={<FaArrowRightLong fontSize={"24px"} />}
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default WelcomeScreenElement;
