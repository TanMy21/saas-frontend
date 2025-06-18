import FeedIcon from "@mui/icons-material/Feed";
import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useGetElementsForSurveyQuery } from "../../app/slices/elementApiSlice";
import { useAppTheme } from "../../theme/useAppTheme";
import { formatDate } from "../../utils/formatDate";
import { SurveyListCardProps } from "../../utils/types";

import ListSurveyCardMetricIndicator from "./ListSurveyCardMetricIndicator";
import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";

const SurveyListCard = ({
  survey,
  workspaceId,
  workspaceName,
}: SurveyListCardProps) => {
  const { brand, background, textStyles, borders, iconStyle } =
    useAppTheme();
  const navigate = useNavigate();
  const { data: elements = [] } = useGetElementsForSurveyQuery(survey.surveyID);

  const goToSurvey = (surveyID: string) => {
    navigate(`/survey/${surveyID}`, {
      state: { workspaceId, workspaceName },
    });
  };

  return (
    <>
      <Box
        key={survey.surveyID}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
          width: "98%",
          height: { lg: "56px", xl: "64px" },
          margin: "auto",
          backgroundColor: background.paper,
          borderRadius: 5,
          border: borders.strong,
          mt: "12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: "52px",
            gap: 2,
            padding: "8px",
            // border: "2px solid black",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "64%",
              height: "100%",
              // border: "2px solid green",
            }}
          >
            <ButtonBase
              onClick={() => goToSurvey(survey.surveyID)}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "98%",
                height: "98%",
                margin: "auto",
                gap: 2,
                pl: 1,
                textTransform: "none",
                // border: "2px solid blue",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: brand.avatarBg2,
                  width: { md: 36, xl: 40 },
                  height: { md: 36, xl: 40 },
                  mb: { lg: "12px", xl: "0px" },
                }}
                variant="rounded"
              >
                <FeedIcon sx={iconStyle.listLayoutIcon} />
              </Avatar>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: "96%",
                  // border: "2px solid purple",
                }}
              >
                <Typography sx={textStyles.cardSurveyTitle} noWrap>
                  {survey.title}
                </Typography>
                <Typography
                  sx={{ ...textStyles.cardSurveyCreatedAt, mb: { md: 2 } }}
                >
                  created: {formatDate(survey.createdAt)}
                </Typography>
              </Box>
            </ButtonBase>
          </Box>
          <ListSurveyCardMetricIndicator
            value={`${elements.length}`}
            title={"Questions"}
          />
          <ListSurveyCardMetricIndicator value={`0`} title={"Responses"} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              alignItems: "center",
              width: "20%",
              height: "96%",
              pr: 1,
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
      </Box>
    </>
  );
};

export default SurveyListCard;
