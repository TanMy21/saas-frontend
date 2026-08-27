import { SyntheticEvent } from "react";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { ActivityView } from "../../types/accountSettingsTypes";
import AuditLogsTable from "../OrgActivity/AuditLogsTable";
import UserSessionsTable from "../OrgActivity/UserSessionsTable";

export default function ActivityTab({ orgID }: { orgID: string }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeView: ActivityView =
    searchParams.get("activityView") === "audit-logs"
      ? "audit-logs"
      : "sessions";

  const handleChange = (_event: SyntheticEvent, nextView: ActivityView) => {
    const next = new URLSearchParams(searchParams);
    next.set("activityView", nextView);
    setSearchParams(next, { replace: true });
  };

  return (
    <Box component="div" sx={{ p: { xs: 2.5, sm: 4 } }}>
      <Typography component="h2" fontSize={23} fontWeight={800}>
        Activity
      </Typography>

      <Typography sx={{ mt: 0.75, mb: 3 }} color="text.secondary">
        Review organization sessions and audit activity.
      </Typography>

      <Tabs
        value={activeView}
        onChange={handleChange}
        sx={{
          mb: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tab value="sessions" label="Sessions" />
        <Tab value="audit-logs" label="Events" />
      </Tabs>

      {activeView === "sessions" && <UserSessionsTable orgID={orgID} />}

      {activeView === "audit-logs" && <AuditLogsTable orgID={orgID} />}
    </Box>
  );
}
