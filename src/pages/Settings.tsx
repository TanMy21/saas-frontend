import { useState } from "react";

import { Box, Grid, Paper, Tab, Tabs } from "@mui/material";

import {
  DashBoardHeader,
  SettingsPageHeader,
} from "../components/DashBoardHeader";
import ScrollbarStyle from "../components/ScrollbarStyle";
import UpdateInfo from "../components/Settings/UpdateInfo";
import UpdatePassword from "../components/Settings/UpdatePassword";

const Settings = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <ScrollbarStyle />
      <Box
        sx={{
          overflowX: "hidden",
          overflowY: "hidden",
          width: "100%",
          height: "100%",
          "&::-webkit-scrollbar": {
            width: "10px", // Scrollbar width
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1", // Scrollbar track color
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#61A5D2", // Scrollbar thumb color
            borderRadius: "10px", // Rounded corners on the scrollbar thumb
            "&:hover": {
              background: "#555", // Scrollbar thumb hover color
            },
          },
        }}
      >
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
                    backgroundColor: "#FFFFFF",
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
                        color:"#34375D",
                      },
                      ".Mui-selected": {
                        backgroundColor: "#FBF3FA",
                        fontWeight: "bold",
                        color: "#8A36D2",
                        borderRadius: "0 16px 16px 0",
                      },
                      ".MuiTabs-indicator": {
                        left: 0, // Move indicator to the left side
                        right: "auto", // Remove indicator from the right
                        width: "4px", // Width of the indicator
                        backgroundColor: "#8020CE", // Blue color for the indicator
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
                    borderLeft: "2px solid #E5E7EB",
                    backgroundColor: "#FFFFFF",
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
