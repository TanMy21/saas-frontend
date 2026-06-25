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
import { UserRoundPlus } from "lucide-react";

import {
  useDeleteOrgUserMutation,
  useGetOrgInvitesQuery,
  useGetOrgUsersQuery,
} from "../../app/slices/userApiSlice";
import useAuth from "../../hooks/useAuth";
import { OrgMember } from "../../types/userTypes";
import { hasMinimumPlan } from "../../utils/planLimits";
import { MemberDrawer } from "../OrgMembers/MemberDrawer";
import { MembersTable } from "../OrgMembers/MembersTable";

export const OrgMembers = () => {
  const { tier = "FREE" } = useAuth();

  const canManageOrgMembers = hasMinimumPlan(tier, "ENTERPRISE");

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

  const { data: usersData, isLoading: usersLoading } = useGetOrgUsersQuery(
    undefined,
    {
      skip: !canManageOrgMembers,
    },
  );

  const { data: invites, isLoading: invitesLoading } = useGetOrgInvitesQuery(
    undefined,
    {
      skip: !canManageOrgMembers,
    },
  );

  const [deleteOrgUser, { isLoading: deleting }] = useDeleteOrgUserMutation();

  useEffect(() => {
    if (!usersLoading && !invitesLoading) {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }
  }, [usersLoading, invitesLoading]);

  if (!canManageOrgMembers) {
    return (
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          minHeight: "60vh",
          px: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 520,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: 4,
            bgcolor: "white",
            textAlign: "center",
          }}
        >
          <Typography fontSize={22} fontWeight={700} mb={1}>
            Team management is available on Enterprise
          </Typography>

          <Typography fontSize={14} color="text.secondary">
            Invite members, assign roles, and manage organization access with
            the Enterprise plan.
          </Typography>
        </Box>
      </Box>
    );
  }

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
              variant="modalSubmitBtn"
              disabled={isLimitReached}
              onClick={() =>
                setDrawer({ open: true, mode: "add", member: null })
              }
              startIcon={<UserRoundPlus size={20} strokeWidth={2.2} />}
              sx={{
                px: 1,
                "& .MuiButton-startIcon": {
                  mr: 0.85,
                },
              }}
            >
              Add
            </Button>
          </Stack>
        )}
      </Box>

      {/* Table */}
      <Box sx={{ flex: 1, px: 2 }}>
        <MembersTable
          members={usersData?.members || []}
          invites={invites || []}
          isLoading={usersLoading}
          onEdit={(m: any) =>
            setDrawer({ open: true, mode: "edit", member: m })
          }
          onDelete={(m: any) => setDeleteDialog({ open: true, member: m })}
          onResendInvite={(invite: any) => {
            console.log("Resend invite", invite);
          }}
          onCancelInvite={(invite: any) => {
            console.log("Cancel invite", invite);
          }}
        />
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
        <DialogTitle>Remove Member ?</DialogTitle>

        <DialogContent>
          <Typography>This will remove access. Data will remain.</Typography>
        </DialogContent>

        <DialogActions sx={{ gap: 2 }}>
          <Button
            sx={{ color: "#1e293b", fontWeight: 600 }}
            onClick={() => setDeleteDialog({ open: false, member: null })}
          >
            Cancel
          </Button>

          <Button
            variant="modalSubmitBtn"
            color="error"
            disabled={deleting}
            onClick={handleDelete}
            sx={{
              backgroundColor: "red",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
          >
            {deleting ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
