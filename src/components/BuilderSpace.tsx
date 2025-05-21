import { useEffect } from "react";

import { Box } from "@mui/material";

import { resetQuestion, setQuestion } from "../app/slices/elementSlice";
import {
  initializeTypography,
  resetTypography,
} from "../app/slices/elementTypographySlice";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";
import { BuilderSpaceProps, Element } from "../utils/types";

import CanvasConsole from "./CanvasConsole";
import SurveyPreferencesPanel from "./Surveys/SurveyPreferencesPanel";

const BuilderSpace = ({
  questionId,
  display,
  setDisplay,
  noElements,
}: BuilderSpaceProps) => {
  const dispatch = useAppDispatch();
  const Elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements
  );
 
  

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
          height: "auto",
          // border: "4px solid black",
        }}
      >
        
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "20%",
          height: "auto",
          // border: "4px solid red",
        }}
      >
       
      </Box>
    </Box>
  );
};

export default BuilderSpace;
