import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { useGetOrganizationAuditLogsQuery } from "../../app/slices/orgApiSlice";
import { useDebounce } from "../../hooks/useDebounce";

import ActivityBadge from "./ActivityBadge";
import ActivityFilters from "./ActivityFilters";

const PAGE_LIMIT = 25;

const displayValue = (value: string | null | undefined) => value?.trim() || "—";

const formatEnum = (value: string | null | undefined) => {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const LocalTimestamp = ({ value }: { value: string | null | undefined }) => {
  if (!value) return <>—</>;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return <>{value}</>;
  }

  return (
    <Tooltip title={value}>
      <span>
        {new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(date)}
      </span>
    </Tooltip>
  );
};

const getErrorMessage = (error: any): string => {
  switch (error?.data?.code) {
    case "ORGANIZATION_OWNER_REQUIRED":
      return "Only the organization owner can view audit logs.";

    case "ENTERPRISE_PLAN_REQUIRED":
      return "Audit logs are available on the Enterprise plan.";

    case "EMAIL_VERIFICATION_REQUIRED":
      return "Verify your email before viewing audit logs.";

    case "ORGANIZATION_NOT_FOUND":
      return "The active organization could not be found.";

    case "UNAUTHORIZED":
      return "Your session has expired. Please sign in again.";

    default:
      return error?.data?.message || "Unable to load audit logs.";
  }
};

export default function AuditLogsTable({ orgID }: { orgID: string }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("auditSearch") ?? "");

  const debouncedSearch = useDebounce(search, 350);

  const page = Math.max(1, Number(searchParams.get("auditPage") ?? "1") || 1);

  useEffect(() => {
    const currentSearch = searchParams.get("auditSearch") ?? "";

    if (currentSearch === debouncedSearch) return;

    const next = new URLSearchParams(searchParams);

    if (debouncedSearch.trim()) {
      next.set("auditSearch", debouncedSearch.trim());
    } else {
      next.delete("auditSearch");
    }

    next.set("auditPage", "1");
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  const updatePage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("auditPage", String(nextPage));
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);

    [
      "auditSearch",
      "auditActorEmail",
      "auditEntityType",
      "auditActionType",
      "auditEntityID",
      "auditPage",
    ].forEach((key) => next.delete(key));

    setSearch("");
    setSearchParams(next, { replace: true });
  };

  const { data, error, isLoading, isFetching, isError, refetch } =
    useGetOrganizationAuditLogsQuery({
      orgID,
      filters: {
        page,
        limit: PAGE_LIMIT,
        search: debouncedSearch.trim() || undefined,
      },
    });

  const logs = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <Stack spacing={2.5}>
      <ActivityFilters
        searchLabel="Search events"
        searchPlaceholder="Actor, action, entity..."
        search={search}
        onSearchChange={(value) => {
          setSearch(value);

          if (page !== 1) {
            updatePage(1);
          }
        }}
        onClear={clearFilters}
      />

      {isFetching && !isLoading && (
        <Typography variant="caption" color="text.secondary">
          Updating results…
        </Typography>
      )}

      {isLoading && (
        <Box
          component="div"
          sx={{ minHeight: 260, display: "grid", placeItems: "center" }}
        >
          <CircularProgress size={30} />
        </Box>
      )}

      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          {getErrorMessage(error)}
        </Alert>
      )}

      {!isLoading && !isError && logs.length === 0 && (
        <Box component="div" sx={{ py: 8, textAlign: "center" }}>
          <Typography fontWeight={700}>No audit logs found</Typography>

          <Typography variant="body2" color="text.secondary">
            Try clearing or changing the current filters.
          </Typography>
        </Box>
      )}

      {!isLoading && !isError && logs.length > 0 && (
        <>
          <TableContainer
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 1050 }}>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell>Actor</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity</TableCell>
                  <TableCell>Occurred at</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.auditID} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {displayValue(log.actor.email)}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {displayValue(log.actor.role)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <ActivityBadge kind="event" value={log.entity.action} />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {formatEnum(log.entity.type)}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {displayValue(log.entity.id)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <LocalTimestamp value={log.createdAt} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {pagination?.total.toLocaleString() ?? 0} audit records
            </Typography>

            <Pagination
              page={pagination?.page ?? page}
              count={Math.max(1, pagination?.totalPages ?? 1)}
              disabled={isFetching}
              onChange={(_event, nextPage) => updatePage(nextPage)}
            />
          </Box>
        </>
      )}
    </Stack>
  );
}
