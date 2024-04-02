import { useNavigate } from "react-router-dom";
import {
  Box,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
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
            xs={4 / 8}
            sm={6 / 8}
            md={8 / 8}
            lg={10 / 8}
            xl={24 / 8}
            key={survey.surveyID}
            sx={{ marginRight: "20px" }}
          >
            <Card
              sx={{
                width: "96%",
                height: "22vh",
                maxHeight: "210px",
                borderRadius: "12px",
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
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyItems: "center",
                    marginBottom: "-10%",
                    alignItems: "center",
                  }}
                >
                  <Box
                    p={2}
                    sx={{
                      zIndex: 20,
                      overflow: "hidden",
                      overflowWrap: "break-word",
                      width: "160px",
                      height: "100px",
                    }}
                    mt={2}
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
                  </Box>
                </CardContent>
              </ButtonBase>
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
                <Box sx={{ marginTop: "-2%" }}>
                  <CardActions>
                    <SurveyCardDropDownMenu survey={survey} />
                  </CardActions>
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
