// import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Box, Grid } from "@mui/material";
import { useGetSurveyByIdQuery } from "../app/slices/surveysApiSlice";
import { useLocation, useParams } from "react-router-dom";
// import { ElementType } from "../utils/types";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import CreateNewSurveyModal from "../components/Modals/CreateNewSurveyModal";
import SurveyBuilderLeftSidebar from "../components/Surveys/SurveyBuilderLeftSidebar";
import SurveyBuilderCanvas from "../components/Surveys/SurveyBuilderCanvas";

const SurveyBuilder = () => {
  const { surveyID } = useParams();
  // const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId, workspaceName } = location.state || {};
  const isOpen = location.state?.openModal || false;
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  // const [elements, setElements] = useState<ElementType[]>([]);
  // const [elementDetail, setElementDetail] = useState<ElementType>(elements[0]);
  // const [qIndex, setQIndex] = useState<string>(" ");

  const [questionId, setQuestionId] = useState<string | null>(null);

  const { data: survey } = useGetSurveyByIdQuery(surveyID, {
    skip: !surveyID,
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

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
              survey={survey}
              workspaceId={workspaceId}
              workspaceName={workspaceName}
              title={surveyTitle}
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
                // setElementDetail={setElementDetail}
                setQuestionId={setQuestionId}
              />
            </Grid>
            {/* </Box> */}
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
              <Box
                sx={{
                  marginLeft: "1%",
                  maxWidth: "98%",
                  minHeight: "84%",
                }}
              >
                <SurveyBuilderCanvas
                  survey={survey}
                  questionId={questionId}
                  // elementDetail={elementDetail}
                  // qIndex={qIndex}
                />
              </Box>
            </Grid>
            {/* Right Sidebar */}
            <Grid
              item
              xl={2}
              md={2}
              xs={2}
              sx={{ background: "red", width: "14%", minHeight: "92%" }}
            >
              <Box
                p={2}
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
                Toolbar
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SurveyBuilder;
