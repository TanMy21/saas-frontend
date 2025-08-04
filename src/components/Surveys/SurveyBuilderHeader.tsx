import { useEffect, useState } from "react";

import { Box, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useParams } from "react-router-dom";

import { useGetSurveyCanvasByIdQuery } from "../../app/slices/surveysApiSlice";
import { SurveyBuilderHeaderProps } from "../../utils/types";
import PublishButton from "../Buttons/PublishButton";
import HeaderIconMenu from "../HeaderIconMenu";

import SurveyBuilderHeaderTabs from "./SurveyBuilderHeaders/SurveyBuilderHeaderTabs";
import SurveyNavigation from "./SurveyBuilderHeaders/SurveyNavigation";

const SurveyBuilderHeader = ({
  survey,
  workspaceId,
  workspaceName,
}: SurveyBuilderHeaderProps) => {
  const { surveyID } = useParams();
  const [tabValue, setTabValue] = useState<string>("create");

  const { data: surveyCanvas, refetch: refetchCanvas } =
    useGetSurveyCanvasByIdQuery(surveyID, {
      skip: !surveyID,

      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });
  const { getSurveyCanvas } = surveyCanvas ?? {};
  const {
    title,

    published,
  } = getSurveyCanvas ?? {};

  useEffect(() => {
    if (location.pathname.includes("/results")) {
      setTabValue("results");
    } else if (location.pathname.includes("/flow")) {
      setTabValue("flow");
    } else if (location.pathname.includes("/survey")) {
      setTabValue("create");
    }
  }, [title, location.pathname]);

  useEffect(() => {
    if (surveyID) {
      refetchCanvas();
    }
  }, [surveyID, refetchCanvas]);

  console.log("Survey ID: ", surveyID);
  console.log("Title: ", title);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        m: "0px",
        bgcolor: "white",
        borderBottom: "2px solid #EDEDED",
        width: "100%",
        height: "64px",
        zIndex: 1000,
      }}
    >
      <Toolbar disableGutters>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "2%",
            margin: "auto",
            width: "96%",
            height: "92%",
            // border: "2px solid black",
          }}
        >
          {/* ------------------- workspace name and survey title -------------------- */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              top: "0px",
              marginTop: "0px",
              marginLeft: "-2%",
              width: "36%",
              height: "100%",
              // border: "2px solid red",
            }}
          >
            <SurveyNavigation
              survey={survey}
              surveyTitle={title}
              workspaceId={workspaceId}
              workspaceName={workspaceName}
            />
          </Box>
          {/* ------------------- Tabs ----------------------------------------------- */}
          <Box
            id="survey-builder-tabs"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              top: "0px",
              marginTop: "0px",
              width: "36%",
              height: "100%",
              // border: "2px solid green",
            }}
          >
            <SurveyBuilderHeaderTabs
              tabValue={tabValue}
              setTabValue={setTabValue}
              surveyID={getSurveyCanvas?.surveyID}
              survey={survey}
              workspaceId={workspaceId}
              workspaceName={workspaceName}
            />
          </Box>
          {/* ------------------- Header Icon ---------------------------------------- */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              top: "0px",
              marginTop: "0px",
              width: "32%",
              height: "100%",
              // border: "2px solid orange",
            }}
          >
            <PublishButton
              surveyID={getSurveyCanvas?.surveyID}
              published={published}
            />
            <HeaderIconMenu />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SurveyBuilderHeader;
