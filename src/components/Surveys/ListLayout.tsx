import { Grid, Typography } from "@mui/material";
import { WorkspaceLayoutProps } from "../../utils/types";
import SurveyListCard from "./SurveyListCard";

const ListLayout = ({
  surveys,
  workspaceId,
  workspaceName,
  layout,
}: WorkspaceLayoutProps) => {
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
          <Grid item xs={4}>
            <Typography sx={{ fontSize: "14px" }}>Surveys</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ fontSize: "14px" }}>Questions</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ fontSize: "14px" }}>Responses</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ fontSize: "14px" }}>Updated</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ fontSize: "14px" }}>Actions</Typography>
          </Grid>
        </Grid>

        {/* Rows */}
        {surveys.map((survey) => (
          <SurveyListCard
            key={survey.surveyID}
            survey={survey}
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            layout={layout}
          />
        ))}
      </Grid>
    </>
  );
};

export default ListLayout;
