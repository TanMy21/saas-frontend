import { Box, Button } from "@mui/material";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";

import { RootState } from "../../../app/store";
import { useAppTheme } from "../../../theme/useAppTheme";
import { ElementProps } from "../../../utils/types";
import CenteredStack from "../../screen-layout/CenteredStack";
import ResponseContainer from "../../screen-layout/ResponseContainer";
import ScreenRoot from "../../screen-layout/ScreenRoot";

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
    <ScreenRoot>
      <CenteredStack display={display}>
        <ElementQuestionText display={display} />
      </CenteredStack>

      <ResponseContainer display={display}>
        <Box
          sx={{
            transformOrigin: "bottom",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            // border: "2px dashed red",
          }}
        >
          <Button
            sx={{
              borderRadius: 4,
              backgroundColor: primary.dark,
              textTransform: "unset",
              padding: display === "mobile" ? "8px 12px" : "16px 24px",
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
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default WelcomeScreenElement;
