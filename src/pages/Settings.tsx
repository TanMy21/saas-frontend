import { useState } from "react";

import { Box, Grid } from "@mui/material";

import { SettingsPageHeader } from "../components/DashBoardHeader";
import ScrollbarStyle from "../components/ScrollbarStyle";
import BillingTab from "../components/Settings/BillingsTab";
import AccountSettingsGeneral from "../components/Settings/GeneralSettings";
import GlassCard from "../components/Settings/GlassCard";
// import NotificationsTab from "../components/Settings/NotificationsTab";
import SaveBar from "../components/Settings/SaveBar";
import SecurityTab from "../components/Settings/SecurityTab";
import SidebarNav from "../components/Settings/SideBarNav";
import { useAppTheme } from "../theme/useAppTheme";
import { TabId } from "../utils/types";

const Settings = () => {
  const { scrollStyles } = useAppTheme();
  const [activeTab, setActiveTab] = useState<TabId>("general");

  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const showSaveBar = activeTab === "notifications";

  return (
    <>
      {/* <ScrollbarStyle /> */}
      <Box>
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
            <Box
              sx={{
                height: "100%",
                width: "100%",
                background: "transparent",
                px: { xs: 2, sm: 3, lg: 6 },
                py: 4,
              }}
            >
              <Box sx={{ maxWidth: 1280, mx: "auto" }}>
                <Grid container spacing={{ xs: 2, lg: 3 }}>
                  {/* Sidebar */}
                  <Grid item xs={12} lg={3}>
                    <GlassCard>
                      <SidebarNav
                        activeTab={activeTab}
                        onChange={setActiveTab}
                      />
                    </GlassCard>
                  </Grid>

                  {/* Main */}
                  <Grid item xs={12} lg={9}>
                    <GlassCard>
                      {/* Tabs */}
                      {activeTab === "general" && <AccountSettingsGeneral />}

                      {activeTab === "security" && <SecurityTab />}

                      {/* {activeTab === "notifications" && (
                        <NotificationsTab
                          value={notifications}
                          onToggle={handleNotificationToggle}
                        />
                      )} */}

                      {activeTab === "subscription" && <BillingTab />}

                      {/* Save Bar  */}
                      {showSaveBar && (
                        <SaveBar
                          loading={isLoading}
                          success={saveSuccess}
                          onSave={handleSave}
                          onCancel={() => {
                            // restore initial state here if needed
                          }}
                        />
                      )}
                    </GlassCard>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default Settings;
