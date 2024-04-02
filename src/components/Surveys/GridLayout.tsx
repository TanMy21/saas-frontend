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

const GridLayout = ({ surveys, workspaceId, layout }: WorkspaceLayoutProps) => {
  // console.log("GridLayout surveys", layout);
  const navigate = useNavigate();

  const goToSurvey = (surveyID: string) => {
   navigate(`/survey/${surveyID}/create`, { state: { workspaceId, layout } });
  };

  return (
    <>
      {surveys?.map((survey) => (
        <Grid
          item
          xs={1}
          sm={1}
          md={1}
          lg={1}
          xl={1}
          key={survey.surveyID}
          sx={{ marginRight: "10px", marginBottom: "4px" }}
        >
          <Card
            sx={{
              width: "180px",
              height: "210px",
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
                  marginBottom: "-8%",
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
    </>
  );
};

export default GridLayout;
