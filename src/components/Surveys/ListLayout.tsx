import { useNavigate } from "react-router-dom";
import { Avatar, Box, ButtonBase, Grid, Typography } from "@mui/material";
import FeedIcon from "@mui/icons-material/Feed";
import formatDate from "../../utils/formatDate";
import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";
import { WorkspaceLayoutProps } from "../../utils/types";

const ListLayout = ({ surveys, workspaceId, layout }: WorkspaceLayoutProps) => {
  const navigate = useNavigate();
  const goToSurvey = (surveyID: string) => {
    navigate(`/survey/${surveyID}/create`, { state: { workspaceId, layout } });
  };

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={2}
        sx={{ width: "98%", minHeight: "100%", paddingLeft: "2%" }}
      >
        {/* Header */}
        <Grid
          item
          container
          spacing={2}
          sx={{ padding: 2, backgroundColor: "transparent", borderRadius: 2 }}
        >
          <Grid item xs={3}>
            <Typography sx={{ fontSize: "14px" }}>Surveys</Typography>
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontSize: "14px" }}>Questions</Typography>
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontSize: "14px" }}>Responses</Typography>
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontSize: "14px" }}>Updated</Typography>
          </Grid>
          <Grid item xs>
            <Typography sx={{ fontSize: "14px" }}>Actions</Typography>
          </Grid>
        </Grid>

        {/* Rows */}
        {surveys.map((survey) => (
          <Grid
            item
            container
            key={survey.surveyID}
            mt={"12px"}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              boxShadow: "0 6px 9px -9px rgba(0,0,0,0.4)",
            }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "56px",
                marginTop: "-1%",
                padding: "8px",
              }}
            >
              <Grid item xs={3}>
                <Box display={"flex"} flexDirection={"row"} pb={1}>
                  <ButtonBase
                    onClick={() => goToSurvey(survey.surveyID)}
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    <Box>
                      <Avatar
                        sx={{ bgcolor: "#44546A", width: 32, height: 32 }}
                        variant="rounded"
                      >
                        <FeedIcon />
                      </Avatar>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} ml={1}>
                      <Box>
                        <Typography sx={{ fontSize: "12px" }} noWrap>
                          {survey.title}
                        </Typography>
                      </Box>
                      <Box display={"flex"} justifyContent={"start"}>
                        <Typography sx={{ fontSize: "12px", color: "#7E7571" }}>
                          created: {formatDate(survey.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </ButtonBase>
                </Box>
              </Grid>
              <Grid item xs>
                <Typography sx={{ fontSize: "14px" }} mt={1} ml={2}>
                  1
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography sx={{ fontSize: "14px" }} mt={1} ml={2}>
                  0
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography sx={{ fontSize: "14px" }} mt={1}>
                  {formatDate(survey.updatedAt)}
                </Typography>
              </Grid>
              <Grid item xs>
                <SurveyCardDropDownMenu survey={survey} />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ListLayout;
