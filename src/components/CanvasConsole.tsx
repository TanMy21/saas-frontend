import { Box } from "@mui/material";

import { CanvasConsoleProps } from "../utils/types";

import SurveyWelcomeElement from "./Surveys/Elements/SurveyWelcomeElement";
import SurveyBuilderCanvas from "./Surveys/SurveyBuilderCanvas";
import SurveyBuilderCanvasMobile from "./Surveys/SurveyBuilderCanvasMobile";
import SurveyBuilderDock from "./Surveys/SurveyBuilderDock";

const CanvasConsole = ({
  display,
  setDisplay,
  question,
  noElements,
}: CanvasConsoleProps) => {
  let content;
  if (noElements) {
    content = <SurveyWelcomeElement display={display} />;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100%",
        border: "2px solid orange",
      }}
    >
      <SurveyBuilderDock setDisplay={setDisplay} />
      <Box
        sx={{
          marginTop: "2%",
          marginLeft: "1%",
          maxWidth: "98%",
          minHeight: "84%",
        }}
      >
        {noElements ? (
          content
        ) : display === "mobile" ? (
          <SurveyBuilderCanvasMobile question={question} display={display} />
        ) : (
          <SurveyBuilderCanvas question={question} display={display} />
        )}
      </Box>
    </Box>
  );
};

export default CanvasConsole;
