import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import {
  useDeleteOrgUserMutation,
  useGetOrgInvitesQuery,
  useGetOrgUsersQuery,
} from "../../app/slices/userApiSlice";
import { OrgMember } from "../../types/userTypes";
import { InvitesSection } from "../OrgMembers/InvitesSection";
import { MemberDrawer } from "../OrgMembers/MemberDrawer";
import { MembersTable } from "../OrgMembers/MembersTable";

export const OrgMembers = () => {
  const [drawer, setDrawer] = useState<{
    open: boolean;
    mode: "add" | "edit";
    member: any;
  }>({
    open: false,
    mode: "add",
    member: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    member: OrgMember | null;
  }>({
    open: false,
    member: null,
  });
  const { data: usersData, isLoading: usersLoading } = useGetOrgUsersQuery();
  const { data: invites, isLoading: invitesLoading } = useGetOrgInvitesQuery();
  const [deleteOrgUser, { isLoading: deleting }] = useDeleteOrgUserMutation();

  const totalMembers = usersData?.members?.length || 0;
  const activeInvites =
    invites?.filter((i: any) => ["PENDING", "EXPIRED"].includes(i.status)) ||
    [];

  const totalInvites = activeInvites.length;

  const total = totalMembers + totalInvites;

  const isLimitReached = total >= 10;

  const handleDelete = async () => {
    if (!deleteDialog.member) return;
    try {
      await deleteOrgUser(deleteDialog.member.userID).unwrap();
      setDeleteDialog({ open: false, member: null });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!usersLoading && !invitesLoading) {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }
  }, [usersLoading, invitesLoading]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 4,
          py: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography fontSize={20} fontWeight={700}>
            Team Members
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            {usersData?.organizationName
              ? `Manage access for ${usersData.organizationName}`
              : "Manage your team access"}
          </Typography>
        </Box>

        {!isLimitReached && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              disabled={isLimitReached}
              onClick={() =>
                setDrawer({ open: true, mode: "add", member: null })
              }
            >
              Add Member
            </Button>
          </Stack>
        )}
      </Box>

      {/* Table */}
      <Box sx={{ flex: 1, px: 2 }}>
        <MembersTable
          data={usersData}
          isLoading={usersLoading}
          onEdit={(m: any) =>
            setDrawer({ open: true, mode: "edit", member: m })
          }
          onDelete={(m: any) => setDeleteDialog({ open: true, member: m })}
        />

        {/* INVITES SECTION */}
        {!!invites?.length && (
          <Box marginY={4}>
            <Typography fontWeight={600} mb={1}>
              Pending Invitations
            </Typography>

            <InvitesSection invites={invites} />
          </Box>
        )}
      </Box>

      {/* Drawer */}
      <MemberDrawer
        open={drawer.open}
        mode={drawer.mode}
        member={drawer.member}
        isLimitReached={isLimitReached}
        onClose={() => setDrawer({ open: false, mode: "add", member: null })}
      />

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, member: null })}
      >
        <DialogTitle>Remove Member?</DialogTitle>
        <DialogContent>
          <Typography>This will remove access. Data will remain.</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, member: null })}
          >
            Cancel
          </Button>
          <Button color="error" disabled={deleting} onClick={handleDelete}>
            {deleting ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
