import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import HeaderIconMenu from "../HeaderIconMenu";
import { SurveyDropDownMenuProps } from "../../utils/types";
import { NavLink } from "react-router-dom";

const SurveyBuilderHeader = ({
  survey,
  workspaceId,
  workspaceName,
  title,
}: SurveyDropDownMenuProps) => {
  const [value, setValue] = useState(0);
  const [surveyTitle, setSurveyTitle] = useState<string | undefined>("");
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
        width: "100vw",
        height: "52px",
      }}
    >
      <Toolbar disableGutters>
        <Grid container>
          <Grid item xs={3} sx={{ width: "20%", height: "4vh" }}>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 0,
                fontSize: "16px",
                color: "black",
                ml: 4,
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

              <Typography
                sx={{
                  color: "#262666",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "clip",
                  maxWidth: "80%",
                }}
              >
                &nbsp; {surveyTitle ? surveyTitle : survey?.title}
              </Typography>
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
              height: "4vh",
            }}
          >
            <Tabs
              value={value}
              centered
              onChange={handleChange}
              sx={{
                height: "100%",
                width: "60%",
                margin: "-2%",
                fontSize: "16px",
                color: "black",
                ".MuiTabs-indicator": {
                  height: "2px",
                  backgroundColor: "#262627",
                },
                "& .MuiButtonBase-root": {
                  minHeight: "48px",
                },
                "& .Mui-selected": {
                  color: "#262627",
                },
                "& .MuiTab-root": {
                  textTransform: "capitalize",
                  color: "#262627",
                },
              }}
            >
              <Tab label="Create" />
              <Tab label="Share" />
              <Tab label="Results" />
            </Tabs>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              marginTop: -2,
              width: "20%",
              height: "5vh",
            }}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              sx={{ marginTop: "1%" }}
            >
              <Box sx={{ width: "160px" }}>
                <Button
                  sx={{
                    backgroundColor: "#44546A",
                    marginTop: "4%",
                    marginRight: 1,
                    marginLeft: "100%",
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                  size="medium"
                >
                  Publish
                </Button>
              </Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ marginLeft: 8 }}
              />
              <Box
                sx={{
                  marginRight: "12%",
                  marginTop: "2px",
                  md: { marginRight: 0, marginLeft: 50 },
                  lg: { marginRight: 0, marginLeft: 5 },
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
