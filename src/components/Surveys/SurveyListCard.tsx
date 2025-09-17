import { useMemo } from "react";

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
  const { brand, background, primary, textStyles, borders, iconStyle } =
    useAppTheme();
  const navigate = useNavigate();
  const { data: elements = [] } = useGetElementsForSurveyQuery(survey.surveyID);

  const goToSurvey = (surveyID: string) => {
    navigate(`/survey/${surveyID}`, {
      state: { workspaceId, workspaceName },
    });
  };

  const questionCount = useMemo(() => {
    return elements.filter(
      (el) =>
        el.type !== "WELCOME_SCREEN" &&
        el.type !== "END_SCREEN" &&
        el.type !== "INSTRUCTIONS" &&
        el.type !== "EMAIL_CONTACT"
    ).length;
  }, [elements]);

  return (
    <>
      <Box
        key={survey.surveyID}
        sx={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "98%",
          height: { lg: "56px", xl: "64px" },
          margin: "12px auto",
          px: { md: 1.5, lg: 1.5 },
          py: { md: 1.5, lg: 0.25 },
          gap: { xs: 1, md: 2 },
          backgroundColor: background.paper,
          borderRadius: 3,
          border: borders.strong,
          mt: "12px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
          transition:
            "box-shadow 140ms ease, background-color 140ms ease, transform 140ms ease, border-color 140ms ease",
          "&:hover": {
            backgroundColor: background.soft6,
            boxShadow:
              "0 6px 14px rgba(2,43,103,0.08), inset 0 1px 0 rgba(255,255,255,0.35)",
            transform: { md: "translateY(-1px)" },
          },
          "&:focus-within": {
            outline: "2px solid",
            outlineColor: primary.main ?? "#0074EB",
            outlineOffset: "2px",
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "&:hover": { transform: "none" },
          },
          "&:hover::before": { opacity: 1 },
        }}
      >
        <ButtonBase
          onClick={() => goToSurvey(survey.surveyID)}
          sx={{
            display: "flex",
            width: "60%",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: { xs: 1.5, md: 2 },
            height: "100%",
            p: 0,
            textAlign: "left",
            overflow: "hidden",
            textTransform: "none",
            borderRadius: 3,
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <Avatar
            sx={{
              flexShrink: 0,
              bgcolor: brand.avatarBg2,
              width: { md: 38, xl: 42 },
              height: { md: 38, xl: 42 },
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5)",
              transition: "transform 160ms ease",
              ".MuiButtonBase-root:hover &": { transform: "scale(1.05)" },
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
              overflow: "hidden",
            }}
          >
            <Typography sx={textStyles.cardSurveyTitle} noWrap>
              {survey.title}
            </Typography>
            <Typography sx={textStyles.cardSurveyCreatedAt}>
              Created: {formatDate(survey.createdAt)}
            </Typography>
          </Box>
        </ButtonBase>

        {/* Container for metrics and dropdown, taking 40% */}
        <Box
          sx={{
            width: "40%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // border: "2px solid black",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "80%",
              alignItems: "center",
              gap: { md: 1, lg: 2 },
              // border: "2px solid blue",
            }}
          >
            <ListSurveyCardMetricIndicator
              value={`${questionCount}`}
              title={"Questions"}
            />
            <ListSurveyCardMetricIndicator value={`0`} title={"Responses"} />
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <SurveyCardDropDownMenu
              survey={survey}
              workspaceId={workspaceId}
              workspaceName={workspaceName}
            />
          </Box>
        </Box>

        <Box
          sx={{
            pointerEvents: "none",
            position: "absolute",
            top: -36,
            right: -36,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(0,116,235,0.08), transparent 70%)",
            opacity: 0,
            transition: "opacity 140ms ease",
            "*:hover > &": { opacity: 1 },
          }}
        />
      </Box>
    </>
  );
};

export default SurveyListCard;
