import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import HeaderIconMenu from "../HeaderIconMenu";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ShareIcon from "@mui/icons-material/Share";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { SurveyBuilderHeaderProps } from "../../utils/types";
import { NavLink } from "react-router-dom";

const SurveyBuilderHeader = ({
  // display,
  tabValue,
  survey,
  workspaceId,
  workspaceName,
  title,
  handleScreenChange,
  // handleLayoutChange,
}: SurveyBuilderHeaderProps) => {
  const [surveyTitle, setSurveyTitle] = useState<string | undefined>("");

  useEffect(() => {
    setSurveyTitle(title);
  }, [title]);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        m: "0px",
        bgcolor: "white",
        borderBottom: 1,
        borderColor: "#EDEDED",
        width: "100%",
        height: "60px",
      }}
    >
      <Toolbar disableGutters>
        <Grid container>
          <Grid item xs={3} sx={{ width: "16%", height: "6vh" }}>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 0,
                fontSize: "16px",
                color: "black",
                ml: 4,
                marginTop: { lg: "6%", xl: "4%" },
              }}
            >
              <NavLink
                to={`/dash/w/${workspaceId}`}
                style={({ isActive /*isPending, isTransitioning*/ }) => {
                  return {
                    display: "block",
                    color: isActive ? "#262626" : "#262666",
                    lineHeight: "20px",
                    textDecoration: "none",
                  };
                }}
              >
                <Typography
                  sx={{
                    color: "#898989",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "clip",
                    maxWidth: "100%",
                  }}
                >
                  {workspaceName} /
                </Typography>
              </NavLink>
              <Tooltip title={survey?.title}>
                <Typography
                  sx={{
                    color: "#262666",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "clip",
                    width: { md: "64%", lg: "100%", xl: "98%" },
                  }}
                >
                  &nbsp; {surveyTitle ? surveyTitle : survey?.title}
                </Typography>
              </Tooltip>
            </Typography>
          </Grid>
          {/* Tabs centered in the middle */}
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "start",
              padding: 0,
              top: 0,
              width: "60%",
              height: { xl: "6vh" },
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
                color: "black",
                ".MuiTabs-indicator": {
                  height: "2px",
                  backgroundColor: "#2D71B8",
                },
                "& .MuiButtonBase-root": {
                  minHeight: "48px",
                },
                "& .Mui-selected": {
                  color: "#2D71B8",
                  "& .MuiTab-iconWrapper": {
                    color: "#2D71B8", // Changes the icon color when selected
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
                  color: "#6463EB",
                  "& .MuiTab-iconWrapper": {
                    color: "#6463EB",
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
                  "& .MuiTab-iconWrapper": {
                    color: "#B9A90B",
                  },
                }}
              />
              <Tab
                icon={<ShareIcon />}
                label="Share"
                value="share"
                sx={{
                  fontWeight: 600,
                  color: "#1ED760",
                  "& .MuiTab-iconWrapper": {
                    color: "#1ED760",
                  },
                }}
              />
            </Tabs>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              marginTop: -2,
              width: "20%",
              height: "6vh",
            }}
          >
            <Box
              display={"flex"}
              justifyContent={"space-around"}
              sx={{ width: "96%", marginTop: { lg: "8%", xl: "4%" } }}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"end"}
                sx={{ width: "80%" }}
              >
                <Button
                  sx={{
                    backgroundColor: "#44546A",
                    marginRight: "4%",
                    marginTop: "1%",
                    width: "30%",
                    height: "80%",
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                  size="small"
                >
                  Publish
                </Button>
              </Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                color="#3C3C3C"
              />
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"end"}
                sx={{
                  width: "20%",
                }}
              >
                <HeaderIconMenu />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default SurveyBuilderHeader;
