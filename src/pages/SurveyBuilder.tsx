import { useEffect, useState } from "react";
import { Box, CircularProgress, Divider, Grid } from "@mui/material";
import { useGetSurveyByIdQuery } from "../app/slices/surveysApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import CreateNewSurveyModal from "../components/Modals/CreateNewSurveyModal";
import SurveyBuilderLeftSidebar from "../components/Surveys/SurveyBuilderLeftSidebar";
import SurveyBuilderCanvas from "../components/Surveys/SurveyBuilderCanvas";
import SurveyBuilderCanvasMobile from "../components/Surveys/SurveyBuilderCanvasMobile";
import SurveyBuilderIsland from "../components/Surveys/SurveyBuilderIsland";
import { useGetElementsForSurveyQuery } from "../app/slices/elementApiSlice";
import SurveyWelcomeElement from "../components/Surveys/Elements/SurveyWelcomeElement";
import { Element } from "../utils/types";
import ScrollbarStyle from "../components/ScrollbarStyle";
import ElementSettingsContainer from "../components/Surveys/ElementSettings/ElementSettingsContainer";

const SurveyBuilder = () => {
  const { surveyID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId, workspaceName } = location.state || {};
  const isOpen = location.state?.openModal || false;
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
  }, [isError, error]);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      setLoading(false);
      setNoElements(!Elements || Elements.length === 0);

      if (Elements && Elements.length > 0 && !questionId) {
        const sortedQuestions = [...Elements].sort(
          (a: Element, b: Element) => a.order! - b.order!
        );
        setQuestionId(sortedQuestions[0].questionID);
      }
    } else {
      setLoading(true);
    }
  }, [isLoading, isFetching, Elements, questionId]);

  let content;

  if (loading) {
    content = <CircularProgress />;
  }

  if (noElements) {
    content = <SurveyWelcomeElement />;
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
              workspaceId={workspaceId}
              workspaceName={workspaceName}
              title={surveyTitle}
              // handleScreenChange={handleScreenChange}
            />
          </Grid>
          <CreateNewSurveyModal
            isOpen={isOpen}
            surveyID={surveyID}
            setSurveyTitle={setSurveyTitle}
          />
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
              minHeight: "100vh",
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
                width: "14%",
                minHeight: "92%",
                overflowX: "hidden",
                overflowY: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  background: "white",
                  width: "100%",
                  height: "100%",
                  gap: "1%",
                  position: "sticky",
                  top: "5vh",
                  left: "0",
                  right: "0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "end",
                    width: "92%",
                    margin: "auto",
                    marginTop: "4%",
                    height: { lg: "4%", xl: "2%" },
                    fontSize: "20px",
                    fontWeight: 600,
                    // border: "1px solid red",
                  }}
                >
                  Customization
                </Box>
                <Divider
                  sx={{
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
                    padding: "1%",
                    height: "92%",
                    border: "1px solid black",
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
