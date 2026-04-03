import { useState } from "react";

import { Box } from "@mui/material";

import { useGetMeQuery } from "../app/slices/userApiSlice";
import { SettingsPageHeader } from "../components/DashBoardHeader";
import BillingTab from "../components/Settings/BillingsTab";
import AccountSettingsGeneral from "../components/Settings/GeneralSettings";
import GlassCard from "../components/Settings/GlassCard";
import { OrgMembers } from "../components/Settings/OrgMembers";
// import NotificationsTab from "../components/Settings/NotificationsTab";
import SaveBar from "../components/Settings/SaveBar";
import SecurityTab from "../components/Settings/SecurityTab";
import SidebarNav from "../components/Settings/SideBarNav";
import useAuth from "../hooks/useAuth";
import { useAppTheme } from "../theme/useAppTheme";
import { TabId } from "../utils/types";

const Settings = () => {
  const { scrollStyles } = useAppTheme();
  const { can } = useAuth();

  const { data: user } = useGetMeQuery("User", {
    refetchOnMountOrArgChange: true,
  });

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
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            width: "100%",
            zIndex: 10,
          }}
        >
          <SettingsPageHeader />
        </Box>

        {/* Main Layout */}
        <Box
          sx={{
            width: "100%",
            margin: "auto",
            minHeight: "100%",
            overflowY: "auto",
            ...scrollStyles.builderMain,
          }}
        >
          <Box
            sx={{
              width: "100%",
              px: { xs: 2, sm: 3, lg: 6 },
              pt: 4,
              pb: "4%",
            }}
          >
            <Box
              sx={{
                maxWidth: 1280,
                mx: "auto",
                display: { xs: "block", lg: "flex" },
                gap: { xs: 2, lg: 3 },
              }}
            >
              {/* Sidebar */}
              <Box
                sx={{
                  width: { xs: "100%", lg: "25%" },
                }}
              >
                <GlassCard>
                  <SidebarNav activeTab={activeTab} onChange={setActiveTab} />
                </GlassCard>
              </Box>

              {/* Main Content */}
              <Box
                sx={{
                  width: { xs: "100%", lg: "75%" },
                }}
              >
                <GlassCard>
                  {activeTab === "general" && (
                    <AccountSettingsGeneral user={user} />
                  )}

                  {activeTab === "create-user" && can("INVITE_USER") && (
                    <OrgMembers />
                  )}

                  {activeTab === "security" && <SecurityTab user={user} />}

                  {activeTab === "subscription" && <BillingTab user={user} />}

                  {showSaveBar && (
                    <SaveBar
                      loading={isLoading}
                      success={saveSuccess}
                      onSave={handleSave}
                      onCancel={() => {}}
                    />
                  )}
                </GlassCard>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Settings;
