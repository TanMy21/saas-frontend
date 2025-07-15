import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { resetQuestion, setQuestion } from "../app/slices/elementSlice";
import {
  initializeTypography,
  resetTypography,
} from "../app/slices/elementTypographySlice";
import { setSurveyCanvas } from "../app/slices/surveyCanvasSlice";
import { useGetSurveyCanvasByIdQuery } from "../app/slices/surveysApiSlice";
import { setElements } from "../app/slices/surveySlice";
import { fetchUser, selectUser } from "../app/slices/userSlice";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";
import CanvasConsole from "../components/CanvasConsole";
import CreateNewSurveyModal from "../components/Modals/CreateNewSurveyModal";
import GenerateSurveyModal from "../components/Modals/GenerateSurveyModal";
import ImportQuestionsModal from "../components/Modals/ImportQuestionsModal";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import SurveyBuilderLeftSidebar from "../components/Surveys/SurveyBuilderLeftSidebar";
import SurveyPreferencesPanel from "../components/Surveys/SurveyPreferencesPanel";
import { SurveyCanvasRefetchContext } from "../context/BuilderRefetchCanvas";
import { Element, LocationStateProps } from "../utils/types";

const SurveyBuilder = () => {
  const { surveyID } = useParams();
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const { workspaceId, workspaceName } =
    (location.state as LocationStateProps) || {};

  const isOpen = location.state?.openModal || false;
  const isOpenImport = location.state?.openModalImport || false;
  const isOpenGenerate = location.state?.openModalGenerate || false;
  // const [stepIndex, setStepIndex] = useState(0);
  const [runTour, setRunTour] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [display, setDisplay] = useState<string | null>("desktop");
  const [loading, setLoading] = useState(false);

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements
  );

  const selectedQuestion =
    elements?.find((q: Element) => q.questionID === questionId) || null;

  const noElements = elements.length === 0;
  const {
    data: surveyCanvas,
    isError: isErrorCanvas,
    error: errorCanvas,
    isLoading: isLoadingCanvas,
    isFetching: isFetchingCanvas,
    refetch: refetchCanvas,
  } = useGetSurveyCanvasByIdQuery(surveyID, {
    skip: !surveyID,
    // pollingInterval: 200000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const { getSurveyCanvas } = surveyCanvas ?? {};
  const { questions = [] as Element[], title } = getSurveyCanvas ?? {};

  useEffect(() => {
    if (isErrorCanvas) {
      navigate("/login");
    }
  }, [isErrorCanvas, errorCanvas, navigate]);

  useEffect(() => {
    if (!isLoadingCanvas && !isFetchingCanvas) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isLoadingCanvas, isFetchingCanvas, questions]);

  useEffect(() => {
    if (surveyCanvas) {
      dispatch(setSurveyCanvas(surveyCanvas));
    }
  }, [surveyCanvas, dispatch]);

  useEffect(() => {
    if (questions && questions.length > 0) {
      dispatch(setElements(questions));
    }
  }, [questions]);

  useEffect(() => {
    if (elements && elements.length > 0) {
      const sortedQuestions = [...elements].sort(
        (a: Element, b: Element) => a.order! - b.order!
      );

      if (
        !questionId ||
        !sortedQuestions.find((q) => q.questionID === questionId)
      ) {
        setQuestionId(sortedQuestions[0].questionID);
      }
    }
  }, [elements]);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    setRunTour(true);
  }, []);

  useEffect(() => {
    if (selectedQuestion) {
      dispatch(setQuestion(selectedQuestion));
      dispatch(initializeTypography(selectedQuestion?.questionPreferences));
    } else {
      dispatch(resetQuestion());
      dispatch(resetTypography());
    }
  }, [selectedQuestion?.questionID, dispatch]);

  if (!user) {
    return null;
  }

  const { tours } = user;
  const { hasCompletedBuilderTour, hasSkippedBuilderTour } = tours;

  let isTourEnabled = false;

  if (import.meta.env.VITE_ENABLE_BUILDER_TOUR === "true") {
    isTourEnabled = !hasCompletedBuilderTour && !hasSkippedBuilderTour;
  }

  return (
    <>
      {/* <ScrollbarStyle /> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          border: "2px solid black",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "6vh",
            // border: "2px solid red",
            flexShrink: 0,
          }}
        >
          <SurveyBuilderHeader
            survey={surveyCanvas}
            workspaceId={workspaceId!}
            workspaceName={workspaceName!}
            title={title}
          />
        </Box>
        {/* Builder */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            minHeight: 0,
            height: "calc(100vh - 64px)",
            flexGrow: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "16%",
              height: "94vh",
              flexShrink: 0,
              backgroundColor: "white",
              borderRight: "2px solid #E5E7EB",
            }}
          >
            <SurveyBuilderLeftSidebar
              surveyID={surveyID}
              setQuestionId={setQuestionId}
              elements={elements}
            />
          </Box>
          <Box
            sx={{
              width: { md: "64%", xl: "68%" },
              height: "94vh",
              flexShrink: 0,
            }}
          >
            <SurveyCanvasRefetchContext.Provider value={refetchCanvas}>
              <CanvasConsole
                display={display}
                setDisplay={setDisplay}
                question={selectedQuestion}
                noElements={noElements}
              />
            </SurveyCanvasRefetchContext.Provider>
          </Box>
          <Box
            sx={{
              width: { md: "24%", xl: "16%" },
              height: "100%",
              flexShrink: 0,
              backgroundColor: "white",
              borderLeft: "2px solid #E5E7EB",
              // border: "2px solid green",
            }}
          >
            <SurveyPreferencesPanel
              questionId={questionId}
              question={selectedQuestion}
            />
          </Box>
        </Box>
        <CreateNewSurveyModal
          isOpen={isOpen}
          surveyID={surveyID}
          setSurveyTitle={setSurveyTitle}
        />
        <ImportQuestionsModal isOpen={isOpenImport} surveyID={surveyID} />
        <GenerateSurveyModal openGenerate={isOpenGenerate} />
      </Box>
    </>
  );
};

export default SurveyBuilder;
