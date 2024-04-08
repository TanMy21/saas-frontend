import { useNavigate } from "react-router-dom";
import {
  Box,
  ButtonBase,
  Card,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";
import { WorkspaceLayoutProps } from "../../utils/types";

const GridLayout = ({
  surveys,
  workspaceId,
  workspaceName,
  layout,
}: WorkspaceLayoutProps) => {
  const navigate = useNavigate();

  const goToSurvey = (surveyID: string) => {
    navigate(`/survey/${surveyID}/create`, {
      state: { workspaceId, workspaceName, layout },
    });
  };

  return (
    <>
      <Grid container spacing={0} columns={24} sx={{ marginBottom: "100px" }}>
        {surveys?.map((survey) => (
          <Grid
            item
            xs={12}
            sm={8}
            md={6}
            lg={4}
            xl={3}
            key={survey.surveyID}
            sx={{ marginRight: "20px" }}
          >
            <Card
              sx={{
                width: "96%",
                height: "90%",
                maxWidth: "180px",
                maxHeight: "210px",
                borderRadius: "12px",
              }}
            >
              <Box display={"flex"} flexDirection={"column"}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 20,
                    padding: "20px",
                    margin: "auto",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                    width: "72%",
                    height: "70%",
                    minHeight: "120px",
                  }}
                >
                  <ButtonBase
                    onClick={() => goToSurvey(survey.surveyID)}
                    sx={{
                      width: "100%",
                      display: "block",
                      textTransform: "none",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "block",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontFamily:
                          " BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                        color: "black",
                      }}
                      // noWrap
                    >
                      {survey.title}
                    </Typography>
                  </ButtonBase>
                </Box>
                <Divider />
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                  alignContent={"center"}
                >
                  <Box p={"6px"} mt={1} pl={1}>
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
                    {/* <CardActions> */}
                    <SurveyCardDropDownMenu survey={survey} />
                    {/* </CardActions> */}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default GridLayout;
