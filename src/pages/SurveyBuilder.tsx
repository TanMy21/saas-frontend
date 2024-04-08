// import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Box, Grid } from "@mui/material";
import { useGetSurveyByIdQuery } from "../app/slices/surveysApiSlice";
import { useLocation, useParams } from "react-router-dom";
import { ElementType } from "../utils/types";
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
  const [elements, setElements] = useState<ElementType[]>([]);
  const [elementDetail, setElementDetail] = useState<ElementType>(elements[0]);
  const [qIndex, setQIndex] = useState<string>(" ");
  const { data: survey } = useGetSurveyByIdQuery(surveyID, { skip: !surveyID });

  console.log("Builder: ", surveyTitle);

  return (
    <>
      <Grid container direction={"column"}>
        <Grid
          item
          xs={12}
          sx={{
            width: "100%",
            height: "5vh",
            zIndex: "10",
            position: "sticky",
            top: "0",
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
          workspaceId={workspaceId}
          setSurveyTitle={setSurveyTitle}
        />
        <Grid
          item
          container
          direction={"row"}
          sx={{ width: "100vw", minHeight: "95vh" }}
        >
          <Grid
            item
            mr={1}
            sx={{
              background: "white",
              width: "16%",
              borderRight: 1,
              borderColor: "#EDEDED",
            }}
          >
            {/* Left Sidebar */}
            <SurveyBuilderLeftSidebar
              setElementDetail={setElementDetail}
              setQIndex={setQIndex}
              setElements={setElements}
              elements={elements}
            />
          </Grid>
          <Grid
            item
            xs
            sx={{ bgcolor: "#EDEDED", height: "100vh", overflowY: "auto" }}
          >
            {/* Main content area */}
            <SurveyBuilderCanvas
              survey={survey}
              elementDetail={elementDetail}
              qIndex={qIndex}
            />
          </Grid>
          <Grid item sx={{ background: "white", width: "14%" }}>
            {/* Right Sidebar */}
            <Box
              p={2}
              sx={{
                background: "white",
                height: "100vh",
                position: "fixed",
                top: "5vh",
                right: "0",
              }}
            >
              Toolbar
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SurveyBuilder;
