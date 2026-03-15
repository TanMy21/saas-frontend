import { useEffect, useRef, useState } from "react";

import { Box, Modal } from "@mui/material";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

import { useGetElementsForSurveyQuery } from "../../app/slices/elementApiSlice";
import { setAiQuestionsJustAdded } from "../../app/slices/generateSurveyQuestionSlice";
import { useGenerateSurveyMutation } from "../../app/slices/surveysApiSlice";
import { useAppDispatch } from "../../app/typedReduxHooks";
import { LoaderMode } from "../../types/modalTypes";
import { GenerateSurveyState, nonOrderableTypes } from "../../utils/constants";
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
  const dispatch = useAppDispatch();
  const { data: elements = [] } = useGetElementsForSurveyQuery(surveyID!);
  const questionCount = elements.filter(
    (el) => el.type && !nonOrderableTypes.includes(el.type),
  ).length;
  const timeoutTriggeredRef = useRef(false);
  const [state, setState] = useState<GenerateSurveyState>(
    GenerateSurveyState.LOADING,
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [loaderMode, setLoaderMode] = useState<LoaderMode>("INITIAL");

  const [generateSurvey, { isError, error, isLoading }] =
    useGenerateSurveyMutation();

  const handleClose = () => {
    setOpenGenerate?.(false);
  };

  const handleStartLoading = (mode: LoaderMode) => {
    setLoaderMode(mode);
    setState(GenerateSurveyState.LOADING);
  };

  const handleRepacleConfirm = async () => {
    try {
      handleStartLoading("REPLACE");

      await generateSurvey({
        surveyID: surveyID!,
        numberOfQuestions: questionCount,
        questionTypes: [],
        mode: "REPLACE",
      }).unwrap();

      dispatch(setAiQuestionsJustAdded());

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

  useEffect(() => {
    if (!openGenerate || state !== GenerateSurveyState.LOADING) return;

    // reset timer state
    setElapsedTime(0);
    setShowTimeoutWarning(false);
    timeoutTriggeredRef.current = false;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const next = prev + 1;

        // show warning
        if (next === 45) {
          setShowTimeoutWarning(true);
        }

        // hard timeout only if request still loading
        if (next >= 60 && !timeoutTriggeredRef.current && isLoading) {
          timeoutTriggeredRef.current = true;

          toast.error("Survey generation timed out.", {
            duration: 4000,
            position: "top-right",
          });

          setOpenGenerate?.(false);
        }

        return next;
      });
    }, 1000);

    // stop timer if request finishes
    if (!isLoading) {
      timeoutTriggeredRef.current = true;
    }

    return () => clearInterval(interval);
  }, [state, isLoading]);

  return (
    <Modal open={openGenerate} onClose={handleClose}>
      <Box sx={modalOverlaySx}>
        <Box sx={modalContainerSx}>
          <GenerateSurveyHeader state={state} onClose={handleClose} />

          {state === GenerateSurveyState.LOADING ? (
            <GenerateSurveyLoader
              showTimeoutWarning={showTimeoutWarning}
              mode={loaderMode}
            />
          ) : state === GenerateSurveyState.INITIAL_CONFIG ? (
            <GenerateSurveyForm
              onGenerate={() => handleStartLoading("INITIAL")}
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
              onGenerate={() => handleStartLoading("APPEND")}
              generateSurvey={generateSurvey}
              setOpenGenerate={setOpenGenerate}
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
