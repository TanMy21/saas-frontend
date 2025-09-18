import { useMemo, useState } from "react";

import { Box, Typography } from "@mui/material";

import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/typedReduxHooks";
import { SurveyBuilderLeftSidebarProps } from "../../utils/types";

import AddElementMenu from "./Elements/AddElementMenu";
import ElementsPanel from "./Elements/ElementsPanelNew";

const SurveyBuilderLeftSidebar = ({
  surveyID,
  setQuestionId,
}: SurveyBuilderLeftSidebarProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "2% auto",
          width: "100%",
          height: "64px",
          marginTop: { md: "8%", xl: "4%" },
          // borderBottom: "2px solid #F3F4F6",
        }}
      >
        {/* Menu */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: { xs: 1.25, md: 1.5 },
            px: { xs: 1.5, md: 2 },
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              minWidth: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.1,
                fontSize: { xs: 18, md: 20 },
                color: "#0F172A",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Questions
            </Typography>
            <Box
              aria-label={`question count ${questionCount}`}
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 999,
                fontSize: 20,
                fontWeight: 600,
                lineHeight: 1,
                color: "#1F2937",
                bgcolor: "#F3F4F6",
                border: "1px solid #E5E7EB",
              }}
            >
              {questionCount}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AddElementMenu
              surveyID={surveyID!}
              anchorEl={anchorEl}
              open={open}
              handleClick={handleClick}
              handleClose={handleClose}
            />
          </Box>
        </Box>
      </Box>
      <ElementsPanel setQuestionId={setQuestionId} />
    </Box>
  );
};

export default SurveyBuilderLeftSidebar;
