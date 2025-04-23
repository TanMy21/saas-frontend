import { useEffect } from "react";

import { Box } from "@mui/material";
import { useDispatch } from "react-redux";

import { resetQuestion, setQuestion } from "../app/slices/elementSlice";
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
    if (selectedQuestion) {
      dispatch(setQuestion(selectedQuestion));
      dispatch(initializeTypography(selectedQuestion?.questionPreferences));
    } else {
      dispatch(resetQuestion());
      dispatch(resetTypography());
    }
  }, [selectedQuestion?.questionID, dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        minHeight: "94vh",
        backgroundColor: "#FFFFFF",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: "80%",
          height: "100%",
          // border: "4px solid black",
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
          // border: "4px solid red",
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
