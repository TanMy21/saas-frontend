import { useEffect, useMemo, useState } from "react";

import { Box } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

import { setSurveyCanvas } from "../app/slices/surveyCanvasSlice";
import { useGetSurveyCanvasByIdQuery } from "../app/slices/surveysApiSlice";
import { setGenerateModalOpen } from "../app/slices/surveySlice";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";
import CanvasConsole from "../components/CanvasConsole";
import LogoLoader from "../components/Loaders/LogoLoader";
import CreateNewSurveyModal from "../components/Modals/CreateNewSurveyModal";
import GenerateSurveyModal from "../components/Modals/GenerateSurveyModal";
import ImportQuestionsModal from "../components/Modals/ImportQuestionsModal";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import SurveyBuilderLeftSidebar from "../components/Surveys/SurveyBuilderLeftSidebar";
import SurveyPreferencesPanel from "../components/Surveys/SurveyPreferencesPanel";
import { SurveyCanvasRefetchContext } from "../context/BuilderRefetchCanvas";
// import useBuilderTourEnable from "../hooks/useBuilderTourEnable";
import { useCanvasLoadingAndError } from "../hooks/useCanvasLoadingandError";
import useFetchAuthenticatedUser from "../hooks/useFetchAuthenticatedUser";
import { usePersistedSelectedQuestion } from "../hooks/usePersistSelectedQuestion";
import useSelectedQuestion from "../hooks/useSelectedQuestion";
import useSortElements from "../hooks/useSortElements";
import useSurveyBuilderModalLocation from "../hooks/useSurveyBuilderModalLocation";
import useSurveyBuilderStateReset from "../hooks/useSurveyBuilderStateReset";
import useSyncQuestionsToElements from "../hooks/useSyncQuestionsToElements";
import { Element, LocationStateProps } from "../utils/types";

const SurveyBuilder = () => {
  const { surveyID } = useParams();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { workspaceId, workspaceName } =
    (location.state as LocationStateProps) || {};

  const { isOpen, isOpenImport, isOpenGenerate } =
    useSurveyBuilderModalLocation(location);
  // const [stepIndex, setStepIndex] = useState(0);
  // const isTourEnabled = useBuilderTourEnable(user);
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  // const [questionId, setQuestionId] = useState<string | null>(null);
  const [display, setDisplay] = useState<string | null>("desktop");
  const [loading, setLoading] = useState(false);

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements
  );

  const { questionId, setQuestionId } = usePersistedSelectedQuestion(
    surveyID,
    elements
  );

  const selectedQuestion = useMemo(() => {
    return elements.find((q) => q.questionID === questionId) || null;
  }, [elements, questionId]);

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
  const {
    questions = [] as Element[],
    title,
    shareID,
    published,
  } = getSurveyCanvas ?? {};

  useFetchAuthenticatedUser();
  useSurveyBuilderStateReset(surveyID, refetchCanvas);
  useCanvasLoadingAndError(
    isLoadingCanvas,
    isFetchingCanvas,
    isErrorCanvas,
    setLoading
  );
  useEffect(() => {
    if (surveyCanvas) {
      dispatch(setSurveyCanvas(surveyCanvas));
    }
  }, [surveyCanvas, dispatch]);

  useSyncQuestionsToElements(questions);

  useSortElements(elements, setQuestionId, questionId);
  useSelectedQuestion(selectedQuestion, dispatch);

  useEffect(() => {
    if (location.state?.openGenerate) {
      dispatch(setGenerateModalOpen(true));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (isLoadingCanvas)
    return (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          margin: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LogoLoader />
      </Box>
    );

  return (
    <>
      {/* <ScrollbarStyle /> */}
      <SurveyCanvasRefetchContext.Provider value={refetchCanvas}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            // border: "2px solid black",
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
              workspaceId={workspaceId}
              workspaceName={workspaceName}
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
              <CanvasConsole
                display={display}
                setDisplay={setDisplay}
                question={selectedQuestion}
                noElements={noElements}
                shareID={shareID}
                published={published}
              />
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
      </SurveyCanvasRefetchContext.Provider>
    </>
  );
};

export default SurveyBuilder;
