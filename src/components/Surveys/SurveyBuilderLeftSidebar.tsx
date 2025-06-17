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
          height: "48px",
          marginTop: { md: "8%", xl: "4%" },
          borderBottom: "2px solid #F3F4F6",
        }}
      >
        {/* Menu */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 auto",
            width: "92%",
            height: "98%",
          }}
        >
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
            {`Questions (${questionCount})`}
          </Typography>
          <Box
            id="add-element-menu"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "15%",
              height: "38px",
              // border: "2px solid red",
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
