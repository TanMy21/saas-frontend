import { useEffect, useState } from "react";

import { Box, Modal } from "@mui/material";
import { useParams } from "react-router-dom";

import { useGetElementsForSurveyQuery } from "../../app/slices/elementApiSlice";
import { useGenerateSurveyMutation } from "../../app/slices/surveysApiSlice";
import { GenerateSurveyState } from "../../utils/constants";
import { GenerateSurveyModalProps } from "../../utils/types";
import GenerateSurveyLoader from "../Loaders/GenerateSurveyLoader";

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
  const { data: elements = [] } = useGetElementsForSurveyQuery(surveyID!);
  const questionCount = elements.length;
  const [state, setState] = useState<GenerateSurveyState>(
    GenerateSurveyState.LOADING,
  );

  const [generateSurvey, { isError, error }] = useGenerateSurveyMutation();

  const handleClose = () => {
    setOpenGenerate?.(false);
  };

  const handleStartLoading = () => {
    setState(GenerateSurveyState.LOADING);
  };

  const handleRepacleConfirm = async () => {
    try {
      handleStartLoading();

      await generateSurvey({
        surveyID: surveyID!,
        numberOfQuestions: questionCount,
        questionTypes: [],
        mode: "REPLACE",
      }).unwrap();

      setOpenGenerate?.(false);
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

          {state === GenerateSurveyState.LOADING ? (
            <GenerateSurveyLoader />
          ) : state === GenerateSurveyState.INITIAL_CONFIG ? (
            <GenerateSurveyForm
              onGenerate={handleStartLoading}
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
              onGenerate={handleStartLoading}
              generateSurvey={generateSurvey}
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
