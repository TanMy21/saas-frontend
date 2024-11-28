import { Suspense } from "react";

import {
  Box,
  ButtonBase,
  Divider,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { WorkspaceLayoutProps } from "../../utils/types";

import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";


const GridLayout = ({
  surveys,
  workspaceId,
  workspaceName,
  layout,
}: WorkspaceLayoutProps) => {
  const navigate = useNavigate();

  const goToSurvey = (surveyID: string) => {
    navigate(`/survey/${surveyID}`, {
      state: { workspaceId, workspaceName, layout },
    });
  };

  return (
    <>
      <Grid
        container
        display={"flex"}
        flexDirection={"row"}
        width={"100%"}
        height={"100%"}
        spacing={0}
        columns={12}
        sx={{ marginBottom: "50px" }}
      >
        {surveys?.map((survey) => (
          <Box
            key={survey.surveyID}
            sx={{
              p: 1,
              display: "flex",
              flexDirection: "column",
              maxWidth: 180,
              maxHeight: 210,
              marginRight: "20px",
            }}
          >
            <Suspense
              fallback={
                <Skeleton
                  variant="rectangular"
                  width={180}
                  height={210}
                  animation="wave"
                />
              }
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "180px",
                  height: "210px",
                  borderRadius: "8px",
                  bgcolor: "white",
                }}
              >
                <Box
                  sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "90%",
                    height: "70%",
                  }}
                >
                  <ButtonBase
                    onClick={() => goToSurvey(survey.surveyID)}
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                      textTransform: "none",
                    }}
                  >
                    <Tooltip title={survey.title} placement="top" arrow>
                      <Typography
                        sx={{
                          padding: "1px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "16px",
                          lineHeight: "24px",
                          overflow: "hidden",
                          textOverflow: "clip",
                          minHeight: "88px",
                          maxHeight: "92px",
                          fontFamily:
                            " BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                          color: "black",
                        }}
                      >
                        {survey.title}
                      </Typography>
                    </Tooltip>
                  </ButtonBase>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "auto",
                    width: "98%",
                    height: "20%",
                  }}
                >
                  <Box p={"6px"} pl={1}>
                    <Typography sx={{ fontSize: "12px", color: "#C1C1D3" }}>
                      No Responses
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "1%",
                    }}
                  >
                    <SurveyCardDropDownMenu
                      survey={survey}
                      workspaceId={workspaceId}
                      workspaceName={workspaceName}
                    />
                  </Box>
                </Box>
              </Box>
            </Suspense>
          </Box>
        ))}
      </Grid>
    </>
  );
};

export default GridLayout;
