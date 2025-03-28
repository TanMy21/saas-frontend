import { Box, ButtonBase, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../utils/formatDate";
import { WorkspaceLayoutProps } from "../../utils/types";

import CreateNewSurveyCard from "./CreateNewSurveyCard";
import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";

const GridLayout = ({
  surveys,
  workspaceId,
  workspaceName,
  viewMode,
}: WorkspaceLayoutProps) => {
  const navigate = useNavigate();

  const goToSurvey = (surveyID: string) => {
    navigate(`/survey/${surveyID}`, {
      state: { workspaceId, workspaceName, viewMode },
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 2,
          width: "100%",
          p: 2,
          gridAutoRows: "200px",
          minHeight: "60vh",
          mb: 2,
          maxHeight: {
            lg: "640px",
          },
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "10px", // Scrollbar width
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1", // Scrollbar track color
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#61A5D2", // Scrollbar thumb color
            borderRadius: "10px", // Rounded corners on the scrollbar thumb
            "&:hover": {
              background: "#555", // Scrollbar thumb hover color
            },
          },
        }}
      >
        <CreateNewSurveyCard
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          viewMode={"grid"}
        />
        {surveys?.map((survey) => (
          <Box
            key={survey.surveyID}
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: 2,
              border: "2px solid",
              borderColor: "grey.300",
              p: 1,
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: 3,
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
                      color="grey.900"
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
                    color="#6D7584"
                    sx={{
                      fontSize: "16px",
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
                      backgroundColor: "#EFEFEF",
                      borderRadius: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "32px",
                        color: "#022B67",
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
                        mt: "-8px",
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
                      backgroundColor: "#EFEFEF",
                      borderRadius: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "33px",
                        color: "#022B67",
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
                        mt: "-8px",
                      }}
                    >
                      Responses
                    </Typography>
                  </Box>
                </ButtonBase>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default GridLayout;
