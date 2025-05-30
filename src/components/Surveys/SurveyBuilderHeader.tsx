import { useEffect, useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, IconButton, Tab, Tabs, Toolbar, Tooltip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { FaAngleRight } from "react-icons/fa6";
import { PiFlowArrowBold } from "react-icons/pi";
import { NavLink, useNavigate } from "react-router-dom";

import { SurveyBuilderHeaderProps } from "../../utils/types";
import HeaderIconMenu from "../HeaderIconMenu";

const SurveyBuilderHeader = ({
  survey,
  workspaceId,
  workspaceName,
  title,
}: SurveyBuilderHeaderProps) => {
  const [surveyTitle, setSurveyTitle] = useState<string | undefined>("");
  const [tabValue, setTabValue] = useState<string | null>("create");
  const navigate = useNavigate();

  const { surveyID } = survey || {};

  const headerProps = {
    tabValue,
    survey,
    workspaceId,
    workspaceName,
  };

  const handleScreenChange = (
    _event: React.SyntheticEvent,
    newValue: string
  ) => {
    setTabValue(newValue);

    if (newValue === "results") {
      navigate(`/s/results/${surveyID}`, { state: { headerProps } });
    } else if (newValue === "flow") {
      navigate(`/s/flow/${surveyID}`, { state: { headerProps } });
    } else if (newValue === "create") {
      navigate(`/survey/${surveyID}`, { state: { headerProps } });
    }
  };

  useEffect(() => {
    if (location.pathname.includes("/results")) {
      setTabValue("results");
    } else if (location.pathname.includes("/flow")) {
      setTabValue("flow");
    } else if (location.pathname.includes("/survey")) {
      setTabValue("create");
    }
    setSurveyTitle(title);
  }, [title, location.pathname]);

  const handleNavigationBack = () => {
    navigate(-1);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        m: "0px",
        bgcolor: "white",
        borderBottom: "2px solid #EDEDED",
        width: "100%",
        height: "60px",
        zIndex: 1000,
      }}
    >
      <Toolbar disableGutters>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "2%",
            margin: "auto",
            width: "96%",
            height: "92%",
            // border: "2px solid black",
          }}
        >
          {/* ------------------- workspace name and survey title -------------------- */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              top: "0px",
              marginTop: "0px",
              marginLeft: "-2%",
              width: "36%",
              height: "100%",
              // border: "2px solid red",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                width: "fit-content",
                marginTop: { lg: "1%", xl: "0%" },
                // border: "2px solid blue",
                textOverflow: "clip",
              }}
            >
              <IconButton
                onClick={handleNavigationBack}
                sx={{
                  background: "#F7F7F7",
                  width: "32px",
                  height: "32px",
                  borderRadius: 2,
                  color: "#757575",
                  mr: 4,
                  "&:hover": {
                    backgroundColor: "#F7F7F7",
                  },
                }}
              >
                <ArrowBackIcon fontSize="medium" />
              </IconButton>
              <NavLink
                to={`/dash/w/${workspaceId}`}
                style={({ isActive /*isPending, isTransitioning*/ }) => {
                  return {
                    display: "block",
                    color: isActive ? "#022B67" : "#022B67",
                    lineHeight: "16px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  };
                }}
              >
                {workspaceName} &nbsp;
              </NavLink>
            </Box>
            <Box
              sx={{
                marginTop: { md: "2%", lg: "2%", xl: "1%" },
                color: "#6D7584",
              }}
            >
              <FaAngleRight />
            </Box>
            <Box sx={{ width: "68%" }}>
              <Tooltip title={survey?.title}>
                <Box
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "#6D7584",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "clip",
                  }}
                >
                  &nbsp; {surveyTitle ? surveyTitle : survey?.title}
                </Box>
              </Tooltip>
            </Box>
          </Box>
          {/* ------------------- Tabs ----------------------------------------------- */}
          <Box
            id="survey-builder-tabs"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              top: "0px",
              marginTop: "0px",
              width: "36%",
              height: "100%",
              // border: "2px solid green",
            }}
          >
            <Tabs
              value={tabValue}
              centered
              onChange={handleScreenChange}
              sx={{
                height: "100%",
                width: "60%",
                marginTop: "-4px",
                fontSize: "16px",
                color: "#4F46E5",
                ".MuiTabs-indicator": {
                  height: "2px",
                  backgroundColor: "#4F46E5",
                },
                "& .MuiButtonBase-root": {
                  minHeight: "48px",
                },
                "& .Mui-selected": {
                  color: "#4F46E5",
                  "& .MuiTab-iconWrapper": {
                    color: "#4F46E5", // Changes the icon color when selected
                  },
                },
                "& .MuiTab-root": {
                  textTransform: "capitalize",
                },
              }}
            >
              <Tab
                icon={<BorderColorIcon />}
                label="Create"
                value="create"
                sx={{
                  fontWeight: 600,
                  "&.Mui-selected": {
                    color: "#4F46E5",
                    "& .MuiTab-iconWrapper": {
                      color: "#4F46E5",
                    },
                  },
                }}
              />
              <Tab
                icon={<PiFlowArrowBold size={26} />}
                label="Flow"
                value="flow"
                sx={{
                  fontWeight: 600,
                  color: "#1ABEBE",
                  "&.Mui-selected": {
                    color: "#1ABEBE",
                    "& .MuiTab-iconWrapper": {
                      color: "#1ABEBE",
                    },
                  },
                }}
              />
              <Tab
                icon={<AssessmentIcon />}
                label="Results"
                value="results"
                sx={{
                  fontWeight: 600,
                  color: "#B9A90B",
                  "&.Mui-selected": {
                    color: "#B9A90B",
                    "& .MuiTab-iconWrapper": {
                      color: "#B9A90B",
                    },
                  },
                }}
              />
            </Tabs>
          </Box>
          {/* ------------------- Header Icon ---------------------------------------- */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              top: "0px",
              marginTop: "0px",
              width: "32%",
              height: "100%",
              // border: "2px solid orange",
            }}
          >
            <HeaderIconMenu />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SurveyBuilderHeader;
