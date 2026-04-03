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

export const MemberRow = ({ member, onEdit, onDelete }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { role: actorRole } = useAuth();
  const { user } = member;

  const canDelete =
    member.role !== "OWNER" && (actorRole === "OWNER" || actorRole === "ADMIN");

  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const handleEdit = (e?: any) => {
    if (e) e.stopPropagation();
    closeMenu();
    onEdit(member);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    closeMenu();
    onDelete(member);
  };

  return (
    <TableRow
      hover
      sx={{
        cursor: "pointer",
        "&:hover": { bgcolor: "rgba(15,23,42,0.04)" },
      }}
      onClick={() => onEdit(member)}
    >
      {/* Member */}
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "rgba(15,23,42,0.06)",
              fontWeight: 600,
              color: "black",
            }}
          >
            {user.firstname[0]}
            {user.lastname?.[0]}
          </Avatar>

          <Box>
            <Typography fontSize={14} fontWeight={600} color="black">
              {user.firstname} {user.lastname}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Role */}
      <TableCell>
        <RoleBadge role={member.role} />
      </TableCell>

      {/* Actions */}
      <TableCell align="right">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            openMenu(e);
          }}
        >
          <MoreHorizontal size={18} />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          <MenuItem onClick={(e) => handleEdit(e)}>
            <Edit2 size={14} style={{ marginRight: 8 }} />
            Edit
          </MenuItem>

          {canDelete && (
            <MenuItem
              onClick={(e) => handleDelete(e)}
              sx={{ color: "error.main" }}
            >
              <Trash2 size={14} style={{ marginRight: 8 }} />
              Remove
            </MenuItem>
          )}
        </Menu>
      </TableCell>
    </TableRow>
  );
};
