import { useEffect, useState } from "react";

import { Box, CircularProgress, Divider, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useGetElementsForSurveyQuery } from "../app/slices/elementApiSlice";
import { useGetSurveyByIdQuery } from "../app/slices/surveysApiSlice";
import { fetchUser, selectUser } from "../app/slices/userSlice";
import { AppDispatch } from "../app/store";
import CreateNewSurveyModal from "../components/Modals/CreateNewSurveyModal";
import ImportQuestionsModal from "../components/Modals/ImportQuestionsModal";
import ScrollbarStyle from "../components/ScrollbarStyle";
import SurveyWelcomeElement from "../components/Surveys/Elements/SurveyWelcomeElement";
import ElementSettingsContainer from "../components/Surveys/ElementSettings/ElementSettingsContainer";
import SurveyBuilderCanvas from "../components/Surveys/SurveyBuilderCanvas";
import SurveyBuilderCanvasMobile from "../components/Surveys/SurveyBuilderCanvasMobile";
import SurveyBuilderDock from "../components/Surveys/SurveyBuilderDock";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import SurveyBuilderIsland from "../components/Surveys/SurveyBuilderIsland";
import SurveyBuilderLeftSidebar from "../components/Surveys/SurveyBuilderLeftSidebar";
import SurveyPreferencesPanel from "../components/Surveys/SurveyPreferencesPanel";
import SurveyBuilderTour from "../components/Tour/SurveyBuilderTour";
import { Element, LocationStateProps } from "../utils/types";

const SurveyBuilder = () => {
  const { surveyID } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const { workspaceId, workspaceName } =
    (location.state as LocationStateProps) || {};

  const isOpen = location.state?.openModal || false;
  const isOpenImport = location.state?.openModalImport || false;
  const [stepIndex, setStepIndex] = useState(0);
  const [runTour, setRunTour] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [display, setDisplay] = useState<string | null>("desktop");
  const [loading, setLoading] = useState(false);
  const [noElements, setNoElements] = useState(false);

  const {
    data: survey,
    isError,
    error,
  } = useGetSurveyByIdQuery(surveyID, {
    skip: !surveyID,
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: Elements,
    isLoading,
    isFetching,
  } = useGetElementsForSurveyQuery(surveyID!);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, error, navigate]);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      setLoading(false);
      setNoElements(!Elements || Elements.length === 0);

      if (Elements && Elements.length > 0 && !questionId) {
        const sortedQuestions = [...Elements].sort(
          (a: Element, b: Element) => a.order! - b.order!
        );

        if (
          !questionId ||
          !sortedQuestions.find((q) => q.questionID === questionId)
        ) {
          setQuestionId(sortedQuestions[0].questionID);
        }
      }
    } else {
      setLoading(true);
    }
  }, [isLoading, isFetching, Elements, questionId]);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    setRunTour(true);
  }, []);

  let content;

  if (loading) {
    content = <CircularProgress />;
  }

  if (noElements) {
    content = <SurveyWelcomeElement display={display} />;
  }

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
          overflowX: "hidden",
          overflowY: "scroll",
          width: "100%",
          height: "100%",
          // border: "2px solid black",
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
            flexDirection: "row",
            width: "100%",
            height: "6vh",
            // border: "2px solid red",
          }}
        >
          <SurveyBuilderHeader
            // tabValue={tabValue}
            survey={survey}
            workspaceId={workspaceId!}
            workspaceName={workspaceName!}
            title={surveyTitle}
            // handleScreenChange={handleScreenChange}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            minHeight: "94vh",
            backgroundColor: "#FFFFFF",
            border: "2px solid green",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "16%",
              height: "100%",
              // border: "2px solid blue",
              borderRight: "2px solid #E5E7EB",
            }}
          >
            <SurveyBuilderLeftSidebar
              surveyID={surveyID}
              setQuestionId={setQuestionId}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "68%",
              minHeight: "100%",
              border: "2px solid orange",
            }}
          >
            <SurveyBuilderDock setDisplay={setDisplay} />
            {/* <SurveyBuilderIsland setDisplay={setDisplay} /> */}
            <Box
              sx={{
                marginTop: "2%",
                marginLeft: "1%",
                maxWidth: "98%",
                minHeight: "84%",
              }}
            >
              {noElements ? (
                content
              ) : display === "mobile" ? (
                <SurveyBuilderCanvasMobile
                  survey={survey}
                  questionId={questionId}
                  display={display}
                  // handleLayoutChange={handleLayoutChange}
                />
              ) : (
                <SurveyBuilderCanvas
                  survey={survey}
                  questionId={questionId}
                  display={display}
                  // handleLayoutChange={handleLayoutChange}
                />
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "16%",
              height: "100%",
              // border: "2px solid green",
              borderLeft: "2px solid #E5E7EB",
            }}
          >
            <SurveyPreferencesPanel
              survey={survey}
              questionId={questionId}
              display={display}
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
