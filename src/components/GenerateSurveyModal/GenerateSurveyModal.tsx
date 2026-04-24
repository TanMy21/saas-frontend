import { useEffect, useState } from "react";

import { Box, Modal } from "@mui/material";
import { useParams } from "react-router-dom";

import { useGetElementsForSurveyQuery } from "../../app/slices/elementApiSlice";
import { setAiQuestionsJustAdded } from "../../app/slices/generateSurveyQuestionSlice";
import { hideOverlay, showOverlay } from "../../app/slices/overlaySlice";
import { useGenerateSurveyMutation } from "../../app/slices/surveysApiSlice";
import { useAppDispatch } from "../../app/typedReduxHooks";
import { GenerateSurveyState, nonOrderableTypes } from "../../utils/constants";
import { GenerateSurveyModalProps } from "../../utils/types";

import { GenerateSurveyAppendForm } from "./GenerateSurveyAppendForm";
import { GenerateSurveyForm } from "./GenerateSurveyForm";
import { GenerateSurveyHeader } from "./GenerateSurveyHeader";
import { GenerateSurveyReplaceConfirm } from "./GenerateSurveyReplaceConfirm";
import { GenerateSurveyTools } from "./GenerateSurveyTools";

const modalOverlaySx = {
  position: "fixed",
  inset: 0,
  bgcolor: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: 2,
};

const modalContainerSx = {
  bgcolor: "#fff",
  borderRadius: 4,
  boxShadow: 24,
  width: "100%",
  maxWidth: 600,
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const GenerateSurveyModal = ({
  openGenerate,
  setOpenGenerate,
}: GenerateSurveyModalProps) => {
  const { surveyID } = useParams();
  const dispatch = useAppDispatch();
  const { data: elements = [] } = useGetElementsForSurveyQuery(surveyID!);
  const questionCount = elements.filter(
    (el) => el.type && !nonOrderableTypes.includes(el.type),
  ).length;

  const [state, setState] = useState<GenerateSurveyState>(
    GenerateSurveyState.LOADING,
  );

  const [generateSurvey, { isError, error }] = useGenerateSurveyMutation();

  const handleClose = () => {
    setOpenGenerate?.(false);
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleRepacleConfirm = async () => {
    try {
      handleClose();

      dispatch(
        showOverlay({
          message: "Removing existing questions...",
          variant: "GENERATE",
        }),
      );

      await delay(600);

      dispatch(
        showOverlay({
          message: "Generating new survey structure...",
          variant: "GENERATE",
        }),
      );

      await generateSurvey({
        surveyID: surveyID!,
        numberOfQuestions: questionCount,
        questionTypes: [],
        mode: "REPLACE",
      }).unwrap();

      dispatch(
        showOverlay({
          message: "Finalizing your new survey...",
          variant: "GENERATE",
        }),
      );
      await delay(500);

      dispatch(setAiQuestionsJustAdded());

      dispatch(hideOverlay());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (openGenerate) {
      setState(
        questionCount === 0
          ? GenerateSurveyState.INITIAL_CONFIG
          : GenerateSurveyState.TOOLS,
      );
    }
  }, [openGenerate, questionCount]);

  return (
    <Modal open={openGenerate} onClose={handleClose}>
      <Box sx={modalOverlaySx}>
        <Box sx={modalContainerSx}>
          <GenerateSurveyHeader state={state} onClose={handleClose} />

          {state === GenerateSurveyState.INITIAL_CONFIG ? (
            <GenerateSurveyForm
              generateSurvey={generateSurvey}
              isError={isError}
              error={error}
              setOpenGenerate={setOpenGenerate}
              handleClose={handleClose}
            />
          ) : state === GenerateSurveyState.TOOLS ? (
            <GenerateSurveyTools
              onAppend={() => setState(GenerateSurveyState.APPEND_CONFIG)}
              onReplace={() => setState(GenerateSurveyState.REPLACE_CONFIRM)}
            />
          ) : state === GenerateSurveyState.APPEND_CONFIG ? (
            <GenerateSurveyAppendForm
              onBack={() => setState(GenerateSurveyState.TOOLS)}
              generateSurvey={generateSurvey}
              setOpenGenerate={setOpenGenerate}
              handleClose={handleClose}
            />
          ) : state === GenerateSurveyState.REPLACE_CONFIRM ? (
            <GenerateSurveyReplaceConfirm
              questionCount={questionCount}
              onBack={() => setState(GenerateSurveyState.TOOLS)}
              onConfirm={handleRepacleConfirm}
            />
          ) : null}
        </Box>
      </Box>
    </Modal>
  );
};

export default GenerateSurveyModal;
