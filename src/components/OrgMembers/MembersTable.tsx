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

export const MembersTable = ({ data, isLoading, onEdit, onDelete }: any) => {
  const members = data?.members;

  if (isLoading) return <SkeletonRows />;

  if (!members?.length) return <EmptyState />;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Member</TableCell>
          <TableCell>Role</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>

      <TableBody>
        {members?.map((m: any) => (
          <MemberRow
            key={m.userID}
            member={m}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
};
