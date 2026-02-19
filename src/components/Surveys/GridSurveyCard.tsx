import { Box, ButtonBase, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAppTheme } from "../../theme/useAppTheme";
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
  const { grey, shadows, background, textStyles } = useAppTheme();
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
        position: "relative",
        overflow: "hidden",
        backgroundColor: background.paper,
        borderRadius: 3,
        border: "1px solid",
        borderColor: grey[300],
        p: 1,
        boxShadow: shadows[8],
        transition:
          "box-shadow 120ms ease, transform 120ms ease, border-color 120ms ease",
        cursor: "pointer",
        "&:hover": {
          boxShadow: shadows[12],
          transform: { md: "translateY(-2px)" },
          borderColor: grey[400],
        },
        "&:focus-within": {
          outline: "2px solid",
          outlineColor: "#0074EB",
          outlineOffset: "2px",
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
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
              textAlign: "left",
              borderRadius: 2,
              "&:hover": { backgroundColor: "transparent" },
              // border: "2px solid blue",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "98%",
                height: "36px",
                // border: "2px solid red",
              }}
            >
              <Tooltip title={survey.title} placement="top" arrow>
                <Typography sx={textStyles.cardSurveyTitle}>
                  {survey.title}
                </Typography>
              </Tooltip>
            </Box>
            <Typography
              sx={{ ...textStyles.cardSurveyCreatedAt, fontSize: { md: 16 } }}
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
        {/* Divider */}
        <Box
          sx={{
            width: "98%",
            mx: "auto",
            my: 0.5,
            borderTop: "1px dashed",
            borderColor: grey[200],
          }}
        />

        {/* Metrics */}
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
              borderRadius: 2,
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <GridSurveyCardMetricIndicator
              value={`${survey._count.questions} `}
              title={"Questions"}
            />
            <GridSurveyCardMetricIndicator
              value={`${survey._count.behaviorSessions} `}
              title={"Responses"}
            />
          </ButtonBase>
        </Box>
      </Box>
      <Box
        sx={{
          pointerEvents: "none",
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, rgba(0,116,235,0.08), transparent 70%)",
          opacity: 0,
          transition: "opacity 120ms ease",
          ".MuiBox-root:hover > &": { opacity: 1 },
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      />
    </Box>
  );
};

export default GridSurveyCard;
