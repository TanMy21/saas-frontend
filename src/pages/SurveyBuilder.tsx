import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { resetQuestion, setQuestion } from "../app/slices/elementSlice";
import {
  initializeTypography,
  resetTypography,
} from "../app/slices/elementTypographySlice";
import { useGetSurveyCanvasByIdQuery } from "../app/slices/surveysApiSlice";
import { setElements } from "../app/slices/surveySlice";
import { fetchUser, selectUser } from "../app/slices/userSlice";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";
import CanvasConsole from "../components/CanvasConsole";
import CreateNewSurveyModal from "../components/Modals/CreateNewSurveyModal";
import ImportQuestionsModal from "../components/Modals/ImportQuestionsModal";
import ScrollbarStyle from "../components/ScrollbarStyle";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import SurveyBuilderLeftSidebar from "../components/Surveys/SurveyBuilderLeftSidebar";
import SurveyPreferencesPanel from "../components/Surveys/SurveyPreferencesPanel";
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
  } = useGetSurveyCanvasByIdQuery(surveyID, {
    skip: !surveyID,
    pollingInterval: 200000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { questions = [] as Element[], title } = surveyCanvas || {};

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
      <ScrollbarStyle />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          border: "2px solid black",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "6vh",
            border: "2px solid red",
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
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "stretch",
            overflowX: "hidden",
            overflowY: "auto",
            minHeight: "94vh",
            height: "auto",
            border: "2px solid green",
            "&::-webkit-scrollbar": {
              width: "10px", // Scrollbar width
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1", // Scrollbar track color
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#61A5D2", // Scrollbar thumb color
              borderRadius: "10px", // Rounded corners on the scrollbar thumb
              "&:hover": {
                background: "#555", // Scrollbar thumb hover color
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "16%",
              height: "auto",
              border: "2px solid blue",
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
              display: "flex",
              flexDirection: "column",
              width: "68%",
              height: "auto",
              border: "2px solid blue",
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
              width: "16%",
              height: "auto",
              border: "2px solid blue",
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
      </Box>
    </>
  );
};

export default SurveyBuilder;
