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
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import SurveyBuilderIsland from "../components/Surveys/SurveyBuilderIsland";
import SurveyBuilderLeftSidebar from "../components/Surveys/SurveyBuilderLeftSidebar";
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

  if (import.meta.env.VITE_ENABLE_TOUR === "true") {
    isTourEnabled = !hasCompletedBuilderTour && !hasSkippedBuilderTour;
  }

  return (
    <>
      <ScrollbarStyle />
      <Box
        sx={{
          overflowX: "hidden",
          overflowY: "hidden",
          width: "100%",
          height: "100%",
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
        <Grid container>
          {isTourEnabled && (
            <SurveyBuilderTour
              stepIndex={stepIndex}
              runTour={runTour}
              setStepIndex={setStepIndex}
              setRunTour={setRunTour}
            />
          )}
          <Grid
            item
            display={"flex"}
            flexDirection={"row"}
            xs={12}
            sx={{
              overflowY: "hidden",
              position: "sticky",
              top: "0",
              width: "100%",
              zIndex: "10",
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
          </Grid>
          <CreateNewSurveyModal
            isOpen={isOpen}
            surveyID={surveyID}
            setSurveyTitle={setSurveyTitle}
          />
          <ImportQuestionsModal isOpen={isOpenImport} surveyID={surveyID} />
          <Grid
            item
            xl={12}
            lg={12}
            md={12}
            xs={12}
            display={"flex"}
            flexDirection={"row"}
            sx={{
              width: "100%",
              minHeight: "96vh",
            }}
          >
            {/* content area */}
            {/* Left Sidebar */}
            <Grid
              item
              xl={2}
              lg={2}
              md={2}
              xs={2}
              sx={{
                background: "white",
                position: "sticky",
                top: "5vh",
                left: "0",
                zIndex: "5",
                overflowY: "hidden",
              }}
            >
              <SurveyBuilderLeftSidebar
                surveyID={surveyID}
                setQuestionId={setQuestionId}
              />
            </Grid>

            {/* Main content area */}
            <Grid
              item
              xl={8}
              lg={8}
              md={8}
              xs={8}
              sx={{
                flexGrow: 1,
                width: "80%",
                minHeight: "90%",
                overflowY: "auto",
              }}
            >
              <SurveyBuilderIsland setDisplay={setDisplay} />
              <Box
                sx={{
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
            </Grid>
            {/* Right Sidebar */}
            <Grid
              item
              xl={2}
              md={2}
              xs={2}
              sx={{
                background: "#FFFEFE",
                position: "sticky",
                width: "14%",
                top: "5vh",
                right: "0",
                zIndex: "5",
                minHeight: "92%",
                overflowX: "hidden",
                overflowY: "hidden",
              }}
            >
              <Box
                id="question-settings"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  gap: "1%",
                  left: "0",
                  right: "0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "end",
                    width: "92%",
                    margin: "auto",
                    marginTop: "8%",
                    height: { lg: "24px", xl: "16px" },
                    maxHeight: { lg: "24px", xl: "16px" },
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#3F3F46",
                    // border: "1px solid red",
                  }}
                >
                  Settings
                </Box>
                <Divider
                  sx={{
                    borderWidth: "1px",
                    marginTop: { lg: "0%", xl: "0%" },
                    marginBottom: { lg: "0%", xl: "0%" },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "92%",
                    margin: "auto",
                    marginTop: "0%",
                    // padding: "2px",
                    height: "92%",
                    // border: "1px solid black",
                  }}
                >
                  <ElementSettingsContainer
                    survey={survey}
                    questionId={questionId}
                    display={display}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SurveyBuilder;
