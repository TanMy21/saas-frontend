import { useState } from "react";

import { Box, Grid, Paper, Tab, Tabs } from "@mui/material";

import { SettingsPageHeader } from "../components/DashBoardHeader";
import ScrollbarStyle from "../components/ScrollbarStyle";
import UpdateInfo from "../components/Settings/UpdateInfo";
import UpdatePassword from "../components/Settings/UpdatePassword";
import { useElectricTheme } from "../theme/useElectricTheme";

const Settings = () => {
  const { scrollStyles, borders, background, palette } = useElectricTheme();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <ScrollbarStyle />
      <Box sx={scrollStyles.custom1}>
        <Grid container>
          <Grid
            item
            display={"flex"}
            flexDirection={"row"}
            xs={12}
            sx={{
              overflowY: "hidden",
              position: "sticky",
              top: "0",
              width: "100%",
              zIndex: "10",
            }}
          >
            <SettingsPageHeader />
          </Grid>
          <Box
            sx={{
              display: "flex",
              margin: "auto",
              flexDirection: "row",
              width: "96%",
              height: "92vh",
              // border: "2px solid red",
            }}
          >
            {/* content area */}
            <Paper
              elevation={4}
              sx={{
                display: "flex",
                margin: "auto",
                flexDirection: "column",
                alignItems: "center",
                width: "64%",
                height: "72%",
                maxHeight: "80%",
                borderRadius: "8px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  margin: "auto",
                  width: "96%",
                  height: "100%",
                  // border: "2px solid black",
                }}
              >
                {/* sidebar */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "20%",
                    height: "96%",
                    p: 1,
                    backgroundColor: background.paper,
                    // border: "2px solid red",
                  }}
                >
                  <Tabs
                    orientation="vertical"
                    value={tabIndex}
                    onChange={handleTabChange}
                    aria-label="User settings sections"
                    sx={{
                      ".MuiTab-root": {
                        height: "24px",
                        textTransform: "capitalize",
                        borderRight: "none",
                        color: palette.text.tabRoot,
                      },
                      ".Mui-selected": {
                        backgroundColor: background.soft2,
                        fontWeight: "bold",
                        color: palette.text.tabSelected,
                        borderRadius: "0 16px 16px 0",
                      },
                      ".MuiTabs-indicator": {
                        left: 0,
                        right: "auto",
                        width: "4px",
                        backgroundColor: background.soft3,
                        borderRadius: "0 16px 16px 0",
                      },
                    }}
                  >
                    <Tab label="General" />
                    <Tab label="Security" />
                  </Tabs>
                </Box>
                {/* settings */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "80%",
                    height: "100%",
                    borderLeft: borders.strong,
                    backgroundColor: background.paper,
                  }}
                >
                  {tabIndex === 0 && <UpdateInfo />}
                  {tabIndex === 1 && <UpdatePassword />}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default Settings;
