import FeedIcon from "@mui/icons-material/Feed";
import { Avatar, Box, ButtonBase, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useGetElementsForSurveyQuery } from "../../app/slices/elementApiSlice";
import { formatDate } from "../../utils/formatDate";
import { SurveyListCardProps } from "../../utils/types";

import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";

const SurveyListCard = ({
  survey,
  workspaceId,
  workspaceName,
  layout,
}: SurveyListCardProps) => {
  const navigate = useNavigate();
  const { data: elements = [] } = useGetElementsForSurveyQuery(survey.surveyID);

  const goToSurvey = (surveyID: string) => {
    navigate(`/survey/${surveyID}`, {
      state: { workspaceId, workspaceName, layout },
    });
  };

  return (
    <>
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
          <Grid item xs={4}>
            <Box display={"flex"} flexDirection={"row"} pb={1}>
              <ButtonBase
                onClick={() => goToSurvey(survey.surveyID)}
                sx={{
                  textTransform: "none",
                }}
              >
                <Box>
                  <Avatar
                    sx={{ bgcolor: "#168578", width: 32, height: 32 }}
                    variant="rounded"
                  >
                    <FeedIcon />
                  </Avatar>
                </Box>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  ml={1}
                  width={"100%"}
                  maxWidth={"220px"}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"start"}
                  >
                    <Typography
                      sx={{ fontSize: "12px", textOverflow: "clip" }}
                      noWrap
                    >
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
          <Grid item xs={2}>
            <Typography sx={{ fontSize: "14px" }} mt={1} ml={3}>
              {elements.length}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ fontSize: "14px" }} mt={1} ml={3}>
              0
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ fontSize: "14px" }} mt={1}>
              {formatDate(survey.updatedAt)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <SurveyCardDropDownMenu
              survey={survey}
              workspaceId={workspaceId}
              workspaceName={workspaceName}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SurveyListCard;
