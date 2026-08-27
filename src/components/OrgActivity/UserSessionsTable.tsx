import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useGetOrganizationUserSessionsQuery } from "../../app/slices/orgApiSlice";
import { useDebounce } from "../../hooks/useDebounce";
import LabeledField from "../Settings/LabelField";

const PAGE_LIMIT = 25;

const activitySearchFieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    borderRadius: 2.25,
    backgroundColor: "rgba(255,255,255,0.72)",
    transition:
      "border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",

    "& fieldset": {
      borderColor: "rgba(148,163,184,0.38)",
    },

    "&:hover": {
      backgroundColor: "#fff",

      "& fieldset": {
        borderColor: "rgba(0,116,235,0.58)",
      },
    },

    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 4px rgba(0,116,235,0.11)",

      "& fieldset": {
        borderColor: "#0074EB",
        borderWidth: 1,
      },
    },

    "& input": {
      fontSize: "0.925rem",
      fontWeight: 500,
      color: "#0F172A",
    },

    "& input::placeholder": {
      color: "#94A3B8",
      opacity: 1,
    },
  },
};

const displayValue = (value: string | null | undefined) => value?.trim() || "—";

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
      return "Only the organization owner can view user sessions.";

    case "ENTERPRISE_PLAN_REQUIRED":
      return "User sessions are available on the Enterprise plan.";

    case "EMAIL_VERIFICATION_REQUIRED":
      return "Verify your email before viewing user sessions.";

    case "ORGANIZATION_NOT_FOUND":
      return "The active organization could not be found.";

    case "UNAUTHORIZED":
      return "Your session has expired. Please sign in again.";

    default:
      return error?.data?.message || "Unable to load user sessions.";
  }
};

export default function UserSessionsTable({ orgID }: { orgID: string }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("sessionsSearch") ?? "",
  );

  const debouncedSearch = useDebounce(search, 350);

  const page = Math.max(
    1,
    Number(searchParams.get("sessionsPage") ?? "1") || 1,
  );

  const state = searchParams.get("sessionsState") ?? "";
  const country = searchParams.get("sessionsCountry") ?? "";
  const deviceType = searchParams.get("sessionsDevice") ?? "";

  useEffect(() => {
    const currentSearch = searchParams.get("sessionsSearch") ?? "";

    if (currentSearch === debouncedSearch) return;

    const next = new URLSearchParams(searchParams);

    if (debouncedSearch.trim()) {
      next.set("sessionsSearch", debouncedSearch.trim());
    } else {
      next.delete("sessionsSearch");
    }

    next.set("sessionsPage", "1");
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value.trim()) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    next.set("sessionsPage", "1");
    setSearchParams(next, { replace: true });
  };

  const updatePage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("sessionsPage", String(nextPage));
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);

    [
      "sessionsSearch",
      "sessionsState",
      "sessionsCountry",
      "sessionsDevice",
      "sessionsPage",
    ].forEach((key) => next.delete(key));

    setSearch("");
    setSearchParams(next, { replace: true });
  };

  const { data, error, isLoading, isFetching, isError, refetch } =
    useGetOrganizationUserSessionsQuery({
      orgID,
      filters: {
        page,
        limit: PAGE_LIMIT,
        search: debouncedSearch.trim() || undefined,
        state: state || undefined,
        country: country || undefined,
        deviceType: deviceType || undefined,
      },
    });

  const sessions = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <Stack spacing={2.5}>
      <Box
        component="div"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(220px, 2fr) repeat(3, minmax(130px, 1fr)) auto",
          },
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <LabeledField
          topLabel="Search sessions"
          placeholder="Email, IP, browser, device..."
          value={search}
          sx={activitySearchFieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#64748B" />
              </InputAdornment>
            ),
          }}
          onChange={(event) => {
            setSearch(event.target.value);

            if (page !== 1) {
              updatePage(1);
            }
          }}
        />

        <TextField
          size="small"
          label="Status"
          placeholder="ACTIVE"
          value={state}
          onChange={(event) =>
            updateFilter("sessionsState", event.target.value)
          }
        />

        <Button variant="outlined" onClick={clearFilters}>
          Clear
        </Button>
      </Box>

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

      {!isLoading && !isError && sessions.length === 0 && (
        <Box component="div" sx={{ py: 8, textAlign: "center" }}>
          <Typography fontWeight={700}>No user sessions found</Typography>

          <Typography variant="body2" color="text.secondary">
            Try clearing or changing the current filters.
          </Typography>
        </Box>
      )}

      {!isLoading && !isError && sessions.length > 0 && (
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
                  <TableCell>User</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last active</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.sessionID} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {displayValue(session.user.name)}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {displayValue(session.user.email)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={displayValue(session.state)}
                        color={
                          session.state === "ACTIVE" ? "success" : "default"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <LocalTimestamp value={session.createdAt} />
                    </TableCell>

                    <TableCell>
                      <LocalTimestamp value={session.lastActiveAt} />
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
              {pagination?.total.toLocaleString() ?? 0} sessions
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
