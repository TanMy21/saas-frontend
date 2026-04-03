import { Box } from "@mui/material";

import { InviteRow } from "./InviteRow";

export const InvitesSection = ({ invites }: any) => {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {invites.map((invite: any) => (
        <InviteRow key={invite.inviteID} invite={invite} />
      ))}
    </Box>
  );
};
