import { useState } from "react";

import { Box, Grid, Paper, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import DashBoardHeader from "../components/DashBoardHeader";
import ScrollbarStyle from "../components/ScrollbarStyle";
import UpdateInfo from "../components/Settings/UpdateInfo";
import UpdatePassword from "../components/Settings/UpdatePassword";

const Settings = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  const [sendLogout] = useSendLogoutMutation();

  const onLogoutClicked = () => {
    sendLogout();
    navigate("/");
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
            <DashBoardHeader />
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
                width: "48%",
                height: "72%",
                maxHeight: "80%",
                p: 1,
                borderRadius: "8px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  margin: "auto",
                  width: "96%",
                  height: "96%",
                  flexDirection: "row",
                  // border: "2px solid black",
                }}
              >
                {/* sidebar */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "20%",
                    height: "100%",
                    backgroundColor: "#FFFFFF",
                    // border: "2px solid green",
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
                      },
                      ".Mui-selected": {
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold",
                        borderRadius: "0 16px 16px 0",
                      },
                      ".MuiTabs-indicator": {
                        left: 0, // Move indicator to the left side
                        right: "auto", // Remove indicator from the right
                        width: "4px", // Width of the indicator
                        backgroundColor: "blue", // Blue color for the indicator
                        borderRadius: "0 16px 16px 0",
                      },
                    }}
                  >
                    <Tab label="General" />
                    <Tab label="Security" />
                    <Tab label="Logout" onClick={onLogoutClicked} />
                  </Tabs>
                </Box>

                {/* settings */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "80%",
                    height: "92%",
                    padding: 3,
                    // border: "4px solid green",
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
