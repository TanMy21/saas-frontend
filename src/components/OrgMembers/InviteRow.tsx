import { useState } from "react";

import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { MoreHorizontal, Repeat } from "lucide-react";
import toast from "react-hot-toast";

import {
  useResendOrgInviteMutation,
  useRevokeOrgInviteMutation,
} from "../../app/slices/userApiSlice";

import { RoleBadge } from "./RoleBadge";

export const InviteRow = ({ invite }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [resendInvite, { isLoading: resendLoading }] =
    useResendOrgInviteMutation();

  const [revokeInvite, { isLoading: revokeLoading }] =
    useRevokeOrgInviteMutation();

  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const handleResend = async (e: any) => {
    e.stopPropagation();
    closeMenu();

    try {
      await resendInvite(invite.inviteID).unwrap();

      toast.success("Invite resent successfully", {
        duration: 3000,
        position: "top-right",
      });
    } catch (err) {
      toast.error("Failed to resend invite", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleRevoke = async (e: any) => {
    e.stopPropagation();
    closeMenu();

    try {
      await revokeInvite(invite.inviteID).unwrap();

      toast.success("Invite revoked successfully", {
        duration: 3000,
        position: "top-right",
      });
    } catch (err) {
      toast.error("Failed to revoke invite", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Info */}
      <Box>
        <Typography fontSize={14} fontWeight={600}>
          {invite.firstname} {invite.lastname}
        </Typography>
        <Typography fontSize={13} color="text.secondary">
          {invite.email}
        </Typography>
      </Box>

      {/* Right side */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <RoleBadge role={invite.role} />

        <Typography
          fontSize={12}
          color={invite.status === "EXPIRED" ? "error.main" : "warning.main"}
        >
          {invite.status}
        </Typography>

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            openMenu(e);
          }}
        >
          <MoreHorizontal size={18} />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          <MenuItem onClick={(e) => handleResend(e)} disabled={resendLoading}>
            <Repeat size={16} style={{ marginRight: 8 }} />
            {resendLoading ? "Resending..." : "Resend"}
          </MenuItem>

          <MenuItem
            onClick={(e) => handleRevoke(e)}
            disabled={revokeLoading}
            sx={{ color: "error.main" }}
          >
            {revokeLoading ? "Revoking..." : "Revoke"}
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};
