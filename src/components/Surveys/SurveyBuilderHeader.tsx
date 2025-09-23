import { useEffect, useState } from "react";

import { Box, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useParams } from "react-router-dom";

import { useGetSurveyCanvasByIdQuery } from "../../app/slices/surveysApiSlice";
import { useGetWorkspaceByIdQuery } from "../../app/slices/workspaceApiSlice";
import { LAST_WS_KEY } from "../../utils/constants";
import { SurveyBuilderHeaderProps } from "../../utils/types";
import PublishButton from "../Buttons/PublishButton";
import HeaderIconMenu from "../HeaderIconMenu";

import SurveyBuilderHeaderTabs from "./SurveyBuilderHeaders/SurveyBuilderHeaderTabs";
import SurveyNavigation from "./SurveyBuilderHeaders/SurveyNavigation";

const SurveyBuilderHeader = ({ survey }: SurveyBuilderHeaderProps) => {
  const { surveyID } = useParams();
  const [tabValue, setTabValue] = useState<string>("create");
  const workspaceId = localStorage.getItem(LAST_WS_KEY);

  const { data: workspace } = useGetWorkspaceByIdQuery(workspaceId!, {
    skip: !workspaceId,
  });

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
            alignItems: "center",
            justifyContent: "space-between",
            margin: "auto",
            width: "96%",
            height: "92%",
            // border: "2px solid black",
          }}
        >
          {/* -------------------   Workspace name and survey title ------------------- */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flex: 1,
              // border: "2px solid red",
            }}
          >
            <SurveyNavigation
              survey={survey}
              surveyTitle={title}
              workspaceName={workspace?.name}
            />
          </Box>

          {/* -------------------   Tabs ------------------------------------------- */}

          <Box
            id="survey-builder-tabs"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              // border: "2px solid green",
            }}
          >
            <SurveyBuilderHeaderTabs
              tabValue={tabValue}
              setTabValue={setTabValue}
              surveyID={getSurveyCanvas?.surveyID}
              survey={survey}
              workspaceId={workspaceId!}
              workspaceName={workspace?.name}
            />
          </Box>

          {/* -------------------  Header icon and publish button ------------------- */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flex: 1,
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
