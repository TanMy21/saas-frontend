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
      >
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2, // ~0.5rem * 2 = 8px * 2 = 16px
              borderRadius: "9999px", // fully rounded
              bgcolor: "#005BC4",
              px: 3,
              py: 1,
              fontSize: "1.125rem", // text-lg
              fontWeight: "bold",
              color: "#fff",
              textTransform: "none", // prevent uppercase
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                bgcolor: "#004aa0",
                "& .hover-span": {
                  marginRight: "0.25rem", // animate span shifting
                },
                "& .hover-icon": {
                  width: "1.5rem", // 6
                  opacity: 1,
                },
              },
              "&:focus": {
                outline: "none",
                ring: 2,
              },
              "&:focus-visible": {
                outline: "none",
                boxShadow: "0 0 0 2px #005BC4, 0 0 0 4px #1a1a1a", // focus:ring simulation
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
                alignItems: "center",
              }}
            >
              <MoveRight
                style={{ width: "1.5rem", height: "1.5rem", color: "white" }}
              />
            </Box>
          </Button>
        </Box>
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default WelcomeScreenElement;
