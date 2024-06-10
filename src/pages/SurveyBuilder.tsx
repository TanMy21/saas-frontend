import { useEffect, useState } from "react";
import { Box, Divider, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useGetSurveyByIdQuery } from "../app/slices/surveysApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import CreateNewSurveyModal from "../components/Modals/CreateNewSurveyModal";
import SurveyBuilderLeftSidebar from "../components/Surveys/SurveyBuilderLeftSidebar";
import SurveyBuilderCanvas from "../components/Surveys/SurveyBuilderCanvas";
import SurveyBuilderCanvasMobile from "../components/Surveys/SurveyBuilderCanvasMobile";
import CustomizeElement from "../components/Surveys/CustomizeElement";
import SurveyBuilderIsland from "../components/Surveys/SurveyBuilderIsland";

const SurveyBuilder = () => {
  const { surveyID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId, workspaceName } = location.state || {};
  const isOpen = location.state?.openModal || false;
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  const [value, setValue] = useState("question");
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [display, setDisplay] = useState<string | null>("desktop");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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

  let content;
  // if (tabValue === "results") {
  //   navigate(`/s/results/${surveyID}`, { state: { headerProps } });
  // } else
  if (display === "desktop") {
    content = (
      <SurveyBuilderCanvas
        survey={survey}
        questionId={questionId}
        display={display}
        // handleLayoutChange={handleLayoutChange}
      />
    );
  } else if (display === "mobile") {
    content = (
      <SurveyBuilderCanvasMobile
        survey={survey}
        questionId={questionId}
        display={display}
        // handleLayoutChange={handleLayoutChange}
      />
    );
  } else {
    content = (
      <SurveyBuilderCanvas
        survey={survey}
        questionId={questionId}
        display={display}
        // handleLayoutChange={handleLayoutChange}
      />
    );
  }

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, error]);

  // console.log("Tab: ", tabValue);

  return (
    <>
      <Box
        sx={{
          overflowX: "hidden",
          overflowY: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <Grid container>
          <Grid
            item
            display={"flex"}
            flexDirection={"row"}
            xs={12}
            sx={{
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
                {content}
              </Box>
            </Grid>
            {/* Right Sidebar */}
            <Grid
              item
              xl={2}
              md={2}
              xs={2}
              sx={{ width: "14%", minHeight: "92%" }}
            >
              <Box
                sx={{
                  background: "white",
                  width: "100%",
                  height: "100%",
                  position: "sticky",
                  top: "5vh",
                  left: "0",
                  right: "0",
                }}
              >
                <Box
                  sx={{
                    padding: { md: "2%", lg: "4%", xl: "2%" },
                    width: { md: "84%", lg: "88%", xl: "92%" },
                    height: "48px",
                  }}
                >
                  <Tabs
                    value={value}
                    centered
                    onChange={handleChange}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      height: "80%",
                      width: "100%",
                      fontSize: "20px",
                      color: "black",
                      ".MuiTabs-indicator": {
                        height: "2px",
                        bottom: { lg: 6, xl: 4 },
                        backgroundColor: "black",
                      },
                      "& .MuiButtonBase-root": {
                        maxHeight: "40px",
                      },
                      "& .Mui-selected": {
                        color: "black",
                        "& .MuiTab-iconWrapper": {
                          color: "black",
                        },
                      },
                      "& .MuiTab-root": {
                        textTransform: "capitalize",
                      },
                    }}
                  >
                    <Tab
                      label="Question"
                      value="question"
                      sx={{
                        fontWeight: 600,
                        color: "black",
                      }}
                    />
                    <Tab
                      label="Flow"
                      value="flow"
                      sx={{
                        fontWeight: 600,
                        color: "black",
                      }}
                    />
                  </Tabs>
                </Box>
                <Divider sx={{ marginTop: { lg: "-8%", xl: "-4%" } }} />
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  sx={{
                    width: { md: "99%", lg: "99%", xl: "99%" },
                    height: "84vh",
                    marginTop: "2%",
                    //border: "1px solid red",
                  }}
                >
                  {value === "question" ? (
                    <CustomizeElement />
                  ) : (
                    <Typography variant="h4" ml={4}>
                      Flow
                    </Typography>
                  )}
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
