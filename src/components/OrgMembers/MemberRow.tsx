import { useState } from "react";

import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";

import useAuth from "../../hooks/useAuth";

import { RoleBadge } from "./RoleBadge";
import { StatusBadge } from "./StatusBadge";

export const MemberRow = ({
  row,
  onEdit,
  onDelete,
  onResendInvite,
  onCancelInvite,
}: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { role: actorRole } = useAuth();

  const isInvite = row.type === "invite";

  const user = isInvite ? row : row.user;

  const canDelete =
    !isInvite &&
    row.role !== "OWNER" &&
    (actorRole === "OWNER" || actorRole === "ADMIN");

  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <TableRow
      hover
      sx={{
        "& td": {
          borderBottom: "1px solid #f1f5f9",
        },
        "&:hover": {
          bgcolor: "rgba(2,43,103,0.03)",
        },
      }}
    >
      {/* USER NAME */}
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: 14,
              bgcolor: "#eef2ff",
              color: "#3730a3",
              fontWeight: 600,
            }}
          >
            {user?.firstname?.[0] || "?"}
            {user?.lastname?.[0]}
          </Avatar>

          <Typography fontSize={14} fontWeight={600}>
            {isInvite ? "Invited User" : `${user.firstname} ${user.lastname}`}
          </Typography>
        </Box>
      </TableCell>

      {/* EMAIL */}
      <TableCell>
        <Typography fontSize={13} color="text.secondary">
          {user?.email || row.email}
        </Typography>
      </TableCell>

      {/* ROLE */}
      <TableCell>
        <RoleBadge role={row.role} />
      </TableCell>

      {/* STATUS */}
      <TableCell>
        <StatusBadge status={isInvite ? "PENDING" : "ACTIVE"} />
      </TableCell>

      {/* ACTIONS */}
      <TableCell align="right">
        <IconButton onClick={openMenu}>
          <MoreHorizontal size={18} />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          {!isInvite && (
            <MenuItem
              onClick={() => {
                closeMenu();
                onEdit(row);
              }}
              sx={{ mx: 0.5, borderRadius: 2 }}
            >
              <Edit2 size={14} style={{ marginRight: 8 }} />
              Edit
            </MenuItem>
          )}

          {!isInvite && canDelete && (
            <MenuItem
              onClick={() => {
                closeMenu();
                onDelete(row);
              }}
              sx={{ color: "error.main", mx: 0.5, borderRadius: 2 }}
            >
              <Trash2 size={14} style={{ marginRight: 8 }} />
              Remove
            </MenuItem>
          )}

          {isInvite && (
            <>
              <MenuItem
                onClick={() => {
                  closeMenu();
                  onResendInvite(row);
                }}
                sx={{ mx: 0.5, borderRadius: 2 }}
              >
                Resend Invite
              </MenuItem>

              <MenuItem
                onClick={() => {
                  closeMenu();
                  onCancelInvite(row);
                }}
                sx={{ color: "error.main", mx: 0.5, borderRadius: 2 }}
              >
                Cancel Invite
              </MenuItem>
            </>
          )}
        </Menu>
      </TableCell>
    </TableRow>
  );
};
