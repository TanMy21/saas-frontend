import { Box, ButtonBase, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../utils/formatDate";
import { GridSurveyCardProps } from "../../utils/types";

import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";

const GridSurveyCard = ({
  survey,
  workspaceId,
  workspaceName,
  viewMode,
}: GridSurveyCardProps) => {
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
        backgroundColor: "white",
        borderRadius: 5,
        border: "2px solid",
        borderColor: "grey.300",
        p: 1,
        boxShadow:
          "0px 20px 56px rgba(47, 45, 94, 0.06), 0px 6px 20px rgba(47, 45, 94, 0.06)",
        transition: "all 0.1s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          boxShadow:
            "0px 20px 56px rgba(47, 45, 94, 0.12), 0px 6px 20px rgba(47, 45, 94, 0.24)",
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
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#272F3F"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {survey.title}
              </Typography>
            </Tooltip>
            <Typography
              fontWeight="bold"
              color="#272F3F"
              sx={{
                fontSize: "14px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
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
            height: "40%",
            // border: "2px solid blue",
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
              height: "98%",
              border: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "48%",
                height: "96%",
                border: "none",
                backgroundColor: "#F9F9FA",
                borderRadius: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: "32px",
                  color: "#3B3C3F",
                  fontWeight: "bold",
                }}
              >
                0
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#737783",
                  fontWeight: "bold",
                  mt: "-12px",
                }}
              >
                Questions
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "48%",
                height: "96%",
                border: "none",
                backgroundColor: "#F9F9FA",
                borderRadius: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: "33px",
                  color: "#3B3C3F",
                  fontWeight: "bold",
                }}
              >
                0
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#737783",
                  fontWeight: "bold",
                  mt: "-16px",
                }}
              >
                Responses
              </Typography>
            </Box>
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
};

export default GridSurveyCard;
