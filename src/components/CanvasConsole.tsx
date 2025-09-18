import { useCallback } from "react";

import { Box } from "@mui/material";

import {
  closePublishAlert,
  openPublishAlert,
} from "../app/slices/overlaySlice";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";
import { CanvasConsoleProps } from "../utils/types";

import PublishSurveyAlert from "./alert/PublishSurveyAlert";
import SurveyWelcomeElement from "./Surveys/Elements/SurveyWelcomeElement";
import SurveyBuilderCanvas from "./Surveys/SurveyBuilderCanvas";
import SurveyBuilderCanvasMobile from "./Surveys/SurveyBuilderCanvasMobile";
import SurveyBuilderDock from "./Surveys/SurveyBuilderDock";

const CanvasConsole = ({
  display,
  setDisplay,
  question,
  noElements,
  shareID,
  published,
}: CanvasConsoleProps) => {
  const dispatch = useAppDispatch();

  let content;

  const publishAlertOpen = useAppSelector(
    (s: RootState) => s.overlayUI.publishAlertOpen
  );

  const setPublishOpen: React.Dispatch<React.SetStateAction<boolean>> =
    useCallback(
      (value) => {
        const next =
          typeof value === "function"
            ? (value as (prev: boolean) => boolean)(publishAlertOpen!)
            : value;

        if (next) dispatch(openPublishAlert());
        else dispatch(closePublishAlert());
      },
      [dispatch, publishAlertOpen]
    );

  if (noElements) {
    content = <SurveyWelcomeElement display={display} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflowY: "visible",
        width: "100%",
        // border: "2px solid orange",
      }}
    >
      <SurveyBuilderDock
        setDisplay={setDisplay}
        shareID={shareID}
        published={published}
      />
      <Box
        sx={{
          marginLeft: "1%",
          marginTop: "1%",
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
      <PublishSurveyAlert open={publishAlertOpen!} setOpen={setPublishOpen} />
    </Box>
  );
};

export default CanvasConsole;
