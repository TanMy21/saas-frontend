import { Box, ButtonBase, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useElectricTheme } from "../../theme/useElectricTheme";
import { formatDate } from "../../utils/formatDate";
import { GridSurveyCardProps } from "../../utils/types";

import GridSurveyCardMetricIndicator from "./GridSurveyCardMetricIndicator";
import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";

const GridSurveyCard = ({
  survey,
  workspaceId,
  workspaceName,
  viewMode,
}: GridSurveyCardProps) => {
  const { grey, shadows, background, textStyles } = useElectricTheme();
  const navigate = useNavigate();
  const goToSurvey = (surveyID: string) => {
    navigate(`/survey/${surveyID}`, {
      state: { workspaceId, workspaceName, viewMode },
    });
  };

  return (
    <Box
      key={survey.surveyID}
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: background.paper,
        borderRadius: 4,
        border: "2px solid",
        borderColor: grey[300],
        p: 1,
        boxShadow: shadows[12],
        transition: "all 0.1s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          boxShadow: shadows[13],
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          width: "96%",
          height: "96%",
          // border: "2px solid red",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            margin: "auto",
            width: "98%",
            height: "44%",
            // border: "2px solid green",
          }}
        >
          <ButtonBase
            onClick={() => goToSurvey(survey.surveyID)}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              rowGap: 1,
              width: "88%",
              height: "98%",
              gap: 1,
              textTransform: "none",
              // border: "2px solid blue",
            }}
          >
            <Tooltip title={survey.title} placement="top" arrow>
              <Typography sx={textStyles.cardSurveyTitle}>
                {survey.title}
              </Typography>
            </Tooltip>
            <Typography sx={textStyles.cardSurveyCreatedAt}>
              created: {formatDate(survey.createdAt)}
            </Typography>
          </ButtonBase>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              margin: "auto",
              width: "12%",
              height: "96%",
              // border: "2px solid red",
            }}
          >
            <SurveyCardDropDownMenu
              survey={survey}
              workspaceId={workspaceId}
              workspaceName={workspaceName}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            margin: "auto",
            width: "98%",
            height: "48%",
          }}
        >
          <ButtonBase
            onClick={() => goToSurvey(survey.surveyID)}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 1,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          >
            <GridSurveyCardMetricIndicator value={"0"} title={"Questions"} />
            <GridSurveyCardMetricIndicator value={"0"} title={"Responses"} />
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
};

export default GridSurveyCard;
