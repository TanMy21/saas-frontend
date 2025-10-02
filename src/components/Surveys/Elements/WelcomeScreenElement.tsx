import { Box, Button } from "@mui/material";
import { MoveRight } from "lucide-react";
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
      <CenteredStack
        display={display}
        widthOverride={display === "mobile" ? "98%" : "72%"}
        marginBottomOveride={display === "mobile" ? "32px" : "1px"}
      >
        <ElementQuestionText display={display} />
      </CenteredStack>

      <ResponseContainer
        display={display}
        widthOverride={display === "mobile" ? "98%" : "8px"}
      >
        <Box
          sx={{
            transformOrigin: "bottom",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100px",
            // border: "2px dashed green",
          }}
        >
          <Button
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              borderRadius: "9999px",
              bgcolor: "#005BC4",
              px: 3,
              py: 1,
              fontSize: "1.125rem",
              fontWeight: "bold",
              color: "#fff",
              textTransform: "none",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                bgcolor: "#004aa0",
                "& .hover-span": {
                  marginRight: "0.25rem",
                },
                "& .hover-icon": {
                  width: "1.5rem",
                  opacity: 1,
                },
              },
              "&:focus": {
                outline: "none",
                ring: 2,
              },
              "&:focus-visible": {
                outline: "none",
                boxShadow: "0 0 0 2px #005BC4, 0 0 0 4px #1a1a1a",
              },
            }}
          >
            <Box
              component="span"
              className="hover-span"
              sx={{
                transition: "all 0.3s ease-in-out",
              }}
            >
              {buttonText}
            </Box>

            <Box
              className="hover-icon"
              sx={{
                width: 0,
                overflow: "hidden",
                opacity: 0,
                transition: "all 0.3s ease-in-out",
                display: "flex",
                color: "white",
                alignItems: "center",
              }}
            >
              <MoveRight color="white" size={24} />
            </Box>
          </Button>
        </Box>
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default WelcomeScreenElement;
