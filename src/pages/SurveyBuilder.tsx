import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";

import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Group, Panel, usePanelRef } from "react-resizable-panels";
import { useLocation, useParams } from "react-router-dom";

import { setQuestion, setSelectedQuestionId } from "../app/slices/elementSlice";
import { setSurveyCanvas } from "../app/slices/surveyCanvasSlice";
import { useGetSurveyCanvasByIdQuery } from "../app/slices/surveysApiSlice";
import { openSurveyBuilderAssistant } from "../app/slices/surveySlice";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";
import CanvasConsole from "../components/CanvasConsole";
import LogoLoader from "../components/Loaders/LogoLoader";
import ElementPreferencesPanel from "../components/Surveys/ElementPreferencesPanel";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import SurveyBuilderLeftSidebar from "../components/Surveys/SurveyBuilderLeftSidebar";
import { SurveyBuilderResizeHandle } from "../components/Surveys/SurveyBuilderResizeHandle";
import { SurveyCanvasRefetchContext } from "../context/BuilderRefetchCanvas";
// import useBuilderTourEnable from "../hooks/useBuilderTourEnable";
import useAuth from "../hooks/useAuth";
import { useCanvasLoadingAndError } from "../hooks/useCanvasLoadingandError";
import useFetchAuthenticatedUser from "../hooks/useFetchAuthenticatedUser";
import useSelectedQuestion from "../hooks/useSelectedQuestion";
import useSortElements from "../hooks/useSortElements";
import useSurveyBuilderModalLocation from "../hooks/useSurveyBuilderModalLocation";
import useSurveyBuilderStateReset from "../hooks/useSurveyBuilderStateReset";
import useSyncQuestionsToElements from "../hooks/useSyncQuestionsToElements";
import {
  COMPACT_PANEL_WIDTH,
  CONTEXT_PANEL_MAX_WIDTH,
} from "../utils/constants";
import { Element } from "../utils/types";

const CreateNewSurveyModal = lazy(
  () => import("../components/Modals/CreateNewSurveyModal"),
);

const SurveyBuilder = () => {
  const { surveyID } = useParams();
  const { can } = useAuth();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isWideLayout = useMediaQuery(theme.breakpoints.up("xl"));
  const contextPanelDefaultSize = isWideLayout ? "16%" : "24%";
  const settingsPanelRef = usePanelRef();
  const settingsPanelWidthRef = useRef<number | null>(null);

  const { isOpen, isOpenAssistant } = useSurveyBuilderModalLocation(location);
  // const [stepIndex, setStepIndex] = useState(0);
  // const isTourEnabled = useBuilderTourEnable(user);
  const [_surveyTitle, setSurveyTitle] = useState<string>("");

  const [_loading, setLoading] = useState(false);
  const [hasRestored, setHasRestored] = useState(false);
  const [openScratch, setOpenScratch] = useState(isOpen);
  const [isQuestionsPanelCompact, setIsQuestionsPanelCompact] = useState(false);

  const display = useAppSelector((state: RootState) => state.surveyCanvas.view);

  const activeContextPanel = useAppSelector(
    (state: RootState) => state.surveyBuilder.activeContextPanel,
  );

  const assistantOpenRequestID = useAppSelector(
    (state: RootState) => state.surveyBuilder.assistantOpenRequestID,
  );

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements,
  );

  const selectedQuestionId = useAppSelector(
    (state: RootState) => state.question.selectedQuestionId,
  );

  useEffect(() => {
    if (!elements.length) return;
    if (!hasRestored) return;

    if (!selectedQuestionId) {
      dispatch(setQuestion(elements[0]));
      return;
    }

    const found = elements.find((q) => q.questionID === selectedQuestionId);

    if (found) {
      dispatch(setQuestion(found));
    } else {
      dispatch(setQuestion(elements[0]));
    }
  }, [elements, selectedQuestionId, hasRestored, dispatch]);

  const selectedQuestion = useMemo(() => {
    return elements.find((q) => q.questionID === selectedQuestionId) || null;
  }, [elements, selectedQuestionId]);

  const noElements = elements.length === 0;

  const {
    data: surveyCanvas,
    isError: isErrorCanvas,
    isLoading: isLoadingCanvas,
    isFetching: isFetchingCanvas,
    refetch: refetchCanvas,
  } = useGetSurveyCanvasByIdQuery(surveyID, {
    skip: !surveyID,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { getSurveyCanvas } = surveyCanvas ?? {};
  const {
    questions = [] as Element[],
    title,
    shareID,
    published,
    workspace,
    isLocked,
  } = getSurveyCanvas ?? {};

  const { workspaceId, workspaceName } = workspace || {};

  useFetchAuthenticatedUser();
  useSurveyBuilderStateReset(surveyID, refetchCanvas);
  useCanvasLoadingAndError(
    isLoadingCanvas,
    isFetchingCanvas,
    isErrorCanvas,
    setLoading,
  );
  useEffect(() => {
    if (surveyCanvas) {
      dispatch(setSurveyCanvas(surveyCanvas));
    }
  }, [surveyCanvas, dispatch]);

  useSyncQuestionsToElements(questions);

  useSortElements(elements, selectedQuestionId, dispatch);
  useSelectedQuestion(selectedQuestion, dispatch);

  useEffect(() => {
    if (isLoadingCanvas) return;
    if (activeContextPanel !== "assistant") return;
    if (assistantOpenRequestID === 0) return;

    settingsPanelRef.current?.resize(CONTEXT_PANEL_MAX_WIDTH);
  }, [
    activeContextPanel,
    assistantOpenRequestID,
    isLoadingCanvas,
    settingsPanelRef,
  ]);

  useEffect(() => {
    if (isLoadingCanvas) return;
    if (activeContextPanel !== "settings") return;

    settingsPanelRef.current?.resize(
      settingsPanelWidthRef.current ?? contextPanelDefaultSize,
    );
  }, [
    activeContextPanel,
    contextPanelDefaultSize,
    isLoadingCanvas,
    settingsPanelRef,
  ]);

  useEffect(() => {
    if (isOpenAssistant) {
      dispatch(openSurveyBuilderAssistant());
    }
  }, [isOpenAssistant, dispatch]);

  useEffect(() => {
    if (!surveyID) return;
    if (!elements.length) return;

    const saved = localStorage.getItem(`sq:${surveyID}`);

    if (saved) {
      dispatch(setSelectedQuestionId(saved));
    }

    setHasRestored(true);
  }, [surveyID, elements, dispatch]);

  useEffect(() => {
    if (!surveyID || !selectedQuestionId) return;

    localStorage.setItem(`sq:${surveyID}`, selectedQuestionId);
  }, [surveyID, selectedQuestionId]);

  // const isEditLocked = useAppSelector(
  //   (state: RootState) => state.surveyCanvas.isEditLocked,
  // );

  if (isLoadingCanvas)
    return (
      <Box
        component="div"
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
          component="div"
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
            component="div"
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
              isLocked={isLocked}
            />
          </Box>
          {/* Builder */}
          <Group
            id="survey-builder-layout"
            orientation="horizontal"
            resizeTargetMinimumSize={{ fine: 12, coarse: 24 }}
            style={{
              width: "100%",
              minHeight: 0,
              height: "calc(100vh - 64px)",
              flexGrow: 1,
            }}
          >
            <Panel
              id="survey-builder-questions"
              defaultSize="16%"
              minSize={COMPACT_PANEL_WIDTH}
              maxSize={400}
              groupResizeBehavior="preserve-pixel-size"
              onResize={({ inPixels }) => {
                const isCompact = inPixels <= COMPACT_PANEL_WIDTH + 0.5;

                setIsQuestionsPanelCompact((current) =>
                  current === isCompact ? current : isCompact,
                );
              }}
            >
              <Box
                component="div"
                sx={{
                  width: "100%",
                  height: "94vh",
                  minWidth: 0,
                  backgroundColor: "white",
                }}
              >
                <SurveyBuilderLeftSidebar
                  surveyID={surveyID}
                  elements={elements}
                  compact={isQuestionsPanelCompact}
                />
              </Box>
            </Panel>

            <SurveyBuilderResizeHandle
              id="survey-builder-questions-resize-handle"
              aria-label="Resize questions panel and survey canvas"
              title="Drag to resize panels"
            />

            <Panel
              id="survey-builder-canvas"
              defaultSize={isWideLayout ? "68%" : "60%"}
              minSize={600}
            >
              <Box
                component="div"
                sx={{ width: "100%", height: "94vh", minWidth: 0 }}
              >
                <CanvasConsole
                  display={display}
                  question={selectedQuestion}
                  noElements={noElements}
                  shareID={shareID}
                  published={published}
                  title={title}
                  isLocked={isLocked}
                />
              </Box>
            </Panel>

            <SurveyBuilderResizeHandle
              id="survey-builder-settings-resize-handle"
              aria-label="Resize survey canvas and question settings panel"
              title="Drag to resize panels"
            />

            <Panel
              panelRef={settingsPanelRef}
              id="survey-builder-settings"
              defaultSize={isWideLayout ? "16%" : "24%"}
              minSize={48}
              maxSize={CONTEXT_PANEL_MAX_WIDTH}
              groupResizeBehavior="preserve-pixel-size"
              onResize={({ inPixels }) => {
                if (activeContextPanel === "settings") {
                  settingsPanelWidthRef.current = inPixels;
                }
              }}
            >
              <Box
                component="div"
                sx={{
                  width: "100%",
                  height: "100%",
                  minWidth: 0,
                  backgroundColor: "white",
                }}
              >
                <ElementPreferencesPanel
                  questionId={selectedQuestionId}
                  question={selectedQuestion}
                />
              </Box>
            </Panel>
          </Group>

          <Suspense fallback={null}>
            {can?.("CREATE_SURVEY") && openScratch && (
              <CreateNewSurveyModal
                isOpen={openScratch}
                onClose={() => setOpenScratch(false)}
                surveyID={surveyID}
                setSurveyTitle={setSurveyTitle}
              />
            )}
          </Suspense>
        </Box>
      </SurveyCanvasRefetchContext.Provider>
    </>
  );
};

export default SurveyBuilder;
