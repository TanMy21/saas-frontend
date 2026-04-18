import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { EmptyState } from "./EmptyState";
import { MemberRow } from "./MemberRow";
import { SkeletonRows } from "./SkeletonRows";

const headerCell = {
  fontSize: 14,
  fontWeight: 600,
  color: "#64748b",
  borderBottom: "1px solid #e5e7eb",
};

export const MembersTable = ({
  members = [],
  invites = [],
  isLoading,
  onEdit,
  onDelete,
  onResendInvite,
  onCancelInvite,
}: any) => {
  if (isLoading) return <SkeletonRows />;

  const combined = [
    ...members.map((m: any) => ({ ...m, type: "member" })),
    ...invites.map((i: any) => ({ ...i, type: "invite" })),
  ];

  if (!combined.length) return <EmptyState />;

  return (
    <Table
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 4,
        overflow: "hidden",
        mt:2,
      }}
    >
      {/* HEADER */}
      <TableHead sx={{ bgcolor: "#f8fafc", }}>
        <TableRow>
          <TableCell sx={headerCell}>User</TableCell>
          <TableCell sx={headerCell}>Email</TableCell>
          <TableCell sx={headerCell}>Role</TableCell>
          <TableCell sx={headerCell}>Invite Status</TableCell>
          <TableCell sx={headerCell} align="right" />
        </TableRow>
      </TableHead>

      {/* BODY */}
      <TableBody>
        {combined.map((row: any) => (
          <MemberRow
            key={row.userID || row.inviteID}
            row={row}
            onEdit={onEdit}
            onDelete={onDelete}
            onResendInvite={onResendInvite}
            onCancelInvite={onCancelInvite}
          />
        ))}
      </TableBody>
    </Table>
  );
};
