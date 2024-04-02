import { useState } from "react";
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

const SurveyBuilderHeader = ({ survey }: SurveyDropDownMenuProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        m: "0px",
        bgcolor: "white",
        borderBottom: 1,
        borderColor: "#EDEDED",
        height: "5vh",
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
              <Typography sx={{ color: "#898989" }}>
                Workspace name /
              </Typography>
              <Typography sx={{ color: "#262666" }}>
                &nbsp; {survey?.title}
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
                fontSize: "8px",
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
              <Box>
                <Button
                  sx={{
                    backgroundColor: "#44546A",
                    marginTop: "2%",
                    marginLeft: "100%",
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                  size="medium"
                >
                  Publish
                </Button>
              </Box>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Box sx={{ marginRight: "25%" }}>
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
