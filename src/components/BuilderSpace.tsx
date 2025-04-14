import { useEffect } from "react";

import { Box } from "@mui/material";
import { useDispatch } from "react-redux";

import {
  initializeTypography,
  resetTypography,
} from "../app/slices/elementTypographySlice";
import { BuilderSpaceProps, Element } from "../utils/types";

import CanvasConsole from "./CanvasConsole";
import SurveyPreferencesPanel from "./Surveys/SurveyPreferencesPanel";

const BuilderSpace = ({
  questionId,
  Elements,
  display,
  setDisplay,
  noElements,
}: BuilderSpaceProps) => {
  const dispatch = useDispatch();
  const selectedQuestion =
    Elements?.find((q: Element) => q.questionID === questionId) || null;

  useEffect(() => {
    if (selectedQuestion?.questionPreferences) {
      dispatch(initializeTypography(selectedQuestion.questionPreferences));
    } else {
      dispatch(resetTypography());
    }
  }, [selectedQuestion?.questionID]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          height: "100%",
          border: "4px solid black",
        }}
      >
        <CanvasConsole
          display={display}
          setDisplay={setDisplay}
          question={selectedQuestion}
          noElements={noElements}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "20%",
          height: "100%",
          border: "4px solid red",
        }}
      >
        <SurveyPreferencesPanel
          questionId={questionId}
          question={selectedQuestion}
        />
      </Box>
    </Box>
  );
};

export default BuilderSpace;
