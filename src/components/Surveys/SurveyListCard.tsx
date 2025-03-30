import FeedIcon from "@mui/icons-material/Feed";
import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useGetElementsForSurveyQuery } from "../../app/slices/elementApiSlice";
import { formatDate } from "../../utils/formatDate";
import { SurveyListCardProps } from "../../utils/types";

import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";

const SurveyListCard = ({
  survey,
  workspaceId,
  workspaceName,
}: SurveyListCardProps) => {
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
          height: "64px",
          margin: "auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "2px solid #E5E7EB",
          mt: "12px",
          // boxShadow: "0 6px 9px -9px rgba(0,0,0,0.4)",
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
                sx={{ bgcolor: "#EDE9FE", width: 40, height: 40 }}
                variant="rounded"
              >
                <FeedIcon sx={{ color: "#6E25EB" }} />
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
                <Typography
                  sx={{ fontSize: "16px", textOverflow: "clip" }}
                  noWrap
                >
                  {survey.title}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "#7E7571" }}>
                  created: {formatDate(survey.createdAt)}
                </Typography>
              </Box>
            </ButtonBase>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "20%",
              height: "96%",
              // border: "2px solid red",
            }}
          >
            <Typography
              sx={{ fontSize: "24px", fontWeight: "bold", color: "#0F1828" }}
            >
              {elements.length}
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#6B727F" }}>
              Questions
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "20%",
              height: "96%",
              // border: "2px solid red",
            }}
          >
            <Typography
              sx={{ fontSize: "24px", fontWeight: "bold", color: "#0F1828" }}
            >
              0
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#6B727F" }}>
              Responses
            </Typography>
          </Box>
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
