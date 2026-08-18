import { useMemo, useState } from "react";

import { Box, IconButton, Tooltip, Typography } from "@mui/material";

import { setQuestion } from "../../app/slices/elementSlice";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/typedReduxHooks";
import useAuth from "../../hooks/useAuth";
import { useAppTheme } from "../../theme/useAppTheme";
import { elementIcons } from "../../utils/elementsConfig";
import {
  createDisplayOrderMap,
  isNumberedElement,
  sortElementsByInternalOrder,
} from "../../utils/elementsDisplayOrder";
import { SurveyBuilderLeftSidebarProps } from "../../utils/types";
import { getElementPanelQuestionText } from "../../utils/utils";

import AddElementMenu from "./Elements/AddElementMenu";
import ElementsPanel from "./Elements/ElementsPanelNew";

const SurveyBuilderLeftSidebar = ({
  surveyID,
  compact = false,
}: SurveyBuilderLeftSidebarProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { can } = useAuth();
  const { scrollStyles } = useAppTheme();
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements,
  );

  const selectedQuestionId = useAppSelector(
    (state: RootState) => state.question.selectedQuestionId,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const questionCount = useMemo(() => {
    return elements.filter((el) => isNumberedElement(el.type)).length;
  }, [elements]);

  const orderedElements = useMemo(
    () => sortElementsByInternalOrder(elements),
    [elements],
  );

  const displayOrderMap = useMemo(
    () => createDisplayOrderMap(orderedElements),
    [orderedElements],
  );

  if (compact) {
    return (
      <Box
        component="div"
        aria-label="Survey questions"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            pt: 2,
            pb: 1.5,
            flexShrink: 0,
          }}
        >
          {can("CREATE_QUESTION") && (
            <AddElementMenu
              surveyID={surveyID!}
              anchorEl={anchorEl}
              open={open}
              handleClick={handleClick}
              handleClose={handleClose}
            />
          )}
        </Box>

        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            minHeight: 0,
            flex: 1,
            overflowX: "hidden",
            overflowY: "auto",
            py: 0.75,
            ...scrollStyles.elementsPanel,
          }}
        >
          {orderedElements.map((element) => {
            const isNumbered = isNumberedElement(element.type);
            const displayOrder = displayOrderMap.get(element.questionID);
            const isSelected = element.questionID === selectedQuestionId;
            const label = isNumbered
              ? `Question ${displayOrder}: ${getElementPanelQuestionText(element.text)}`
              : getElementPanelQuestionText(element.text);

            return (
              <Tooltip key={element.questionID} title={label} placement="right">
                <IconButton
                  aria-label={label}
                  aria-pressed={isSelected}
                  onClick={() => dispatch(setQuestion({ ...element }))}
                  sx={{
                    width: 40,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: 2,
                    color: isSelected ? "#4F46E5" : "#64748B",
                    backgroundColor: isSelected ? "#EEF2FF" : "transparent",
                    "&:hover": {
                      backgroundColor: isSelected ? "#E0E7FF" : "#F1F5F9",
                    },
                  }}
                >
                  {isNumbered ? (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "1.1rem",
                        lineHeight: 1,
                        fontWeight: 700,
                      }}
                    >
                      {displayOrder}
                    </Typography>
                  ) : (
                    <Box
                      component="span"
                      sx={{
                        display: "flex",
                        fontSize: "1.5rem",
                        lineHeight: 1,
                      }}
                    >
                      {elementIcons[element.type as keyof typeof elementIcons]}
                    </Box>
                  )}
                </IconButton>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box
        component="div"
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
          component="div"
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
            component="div"
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
              component="div"
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
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {can("CREATE_QUESTION") && (
              <AddElementMenu
                surveyID={surveyID!}
                anchorEl={anchorEl}
                open={open}
                handleClick={handleClick}
                handleClose={handleClose}
              />
            )}
          </Box>
        </Box>
      </Box>
      <ElementsPanel />
    </Box>
  );
};

export default SurveyBuilderLeftSidebar;
