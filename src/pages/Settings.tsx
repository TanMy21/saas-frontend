import { lazy, Suspense, useCallback, useState } from "react";

import { Box, CircularProgress } from "@mui/material";

import { useGetMeQuery } from "../app/slices/userApiSlice";
import { SettingsPageHeader } from "../components/DashBoardHeader";
import AccountSettingsGeneral from "../components/Settings/GeneralSettings";
import GlassCard from "../components/Settings/GlassCard";
// import NotificationsTab from "../components/Settings/NotificationsTab";
import SaveBar from "../components/Settings/SaveBar";
import SidebarNav from "../components/Settings/SideBarNav";
import useAuth from "../hooks/useAuth";
import { useStoredState } from "../hooks/useStoredState";
import { useAppTheme } from "../theme/useAppTheme";
import { SETTINGS_TAB_KEY } from "../utils/constants";
import { TabId } from "../utils/types";

const BillingTab = lazy(() => import("../components/Settings/BillingsTab"));

const SecurityTab = lazy(() => import("../components/Settings/SecurityTab"));

const OrgMembers = lazy(() =>
  import("../components/Settings/OrgMembers").then((module) => ({
    default: module.OrgMembers,
  })),
);

const Settings = () => {
  const { scrollStyles } = useAppTheme();
  const { can } = useAuth();

  const { data: user } = useGetMeQuery("User", {
    refetchOnMountOrArgChange: true,
  });

  const validateTab = useCallback(
    (tab: TabId) => {
      if (!user) return tab;

      if (tab === "create-user" && !can("INVITE_USER")) {
        return "general";
      }

      return tab;
    },
    [can, user],
  );

  const [activeTab, setActiveTab] = useStoredState<TabId>(
    SETTINGS_TAB_KEY,
    "general",
    validateTab,
  );
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
      <Box component="div"
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box component="div"
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
        <Box component="div"
          sx={{
            width: "100%",
            margin: "auto",
            minHeight: "100%",
            overflowY: "auto",
            ...scrollStyles.builderMain,
          }}
        >
          <Box component="div"
            sx={{
              width: "100%",
              px: { xs: 2, sm: 3, lg: 6 },
              pt: 4,
              pb: "4%",
            }}
          >
            <Box component="div"
              sx={{
                maxWidth: 1280,
                mx: "auto",
                display: { xs: "block", lg: "flex" },
                gap: { xs: 2, lg: 3 },
              }}
            >
              {/* Sidebar */}
              <Box component="div"
                sx={{
                  width: { xs: "100%", lg: "25%" },
                }}
              >
                <GlassCard>
                  <SidebarNav activeTab={activeTab} onChange={setActiveTab} />
                </GlassCard>
              </Box>

              {/* Main Content */}
              <Box component="div"
                sx={{
                  width: { xs: "100%", lg: "75%" },
                  "@media (width: 1280px), (width: 1366px)": {
                    width: "calc(75% - 8%)",
                  },
                }}
              >
                <GlassCard>
                  <Suspense
                    fallback={
                      <Box component="div"
                        sx={{
                          minHeight: 320,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CircularProgress size={32} />
                      </Box>
                    }
                  >
                    {activeTab === "general" && (
                      <AccountSettingsGeneral user={user} />
                    )}

                    {activeTab === "create-user" && can("INVITE_USER") && (
                      <OrgMembers />
                    )}

                    {activeTab === "security" && <SecurityTab />}

                    {activeTab === "subscription" && <BillingTab user={user} />}

                    {showSaveBar && (
                      <SaveBar
                        loading={isLoading}
                        success={saveSuccess}
                        onSave={handleSave}
                        onCancel={() => {}}
                      />
                    )}
                  </Suspense>
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
