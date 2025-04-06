import { useEffect, useMemo, useState } from "react";

import { Box, Grow, useMediaQuery, useTheme } from "@mui/material";

import { useGetWorkspaceSurveysQuery } from "../../app/slices/workspaceApiSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { WorkspaceConsoleProps } from "../../utils/types";
import SurveysCollection from "../Surveys/SurveysCollection";

import WorkspaceSurveysPagination from "./WorkspaceSurveysPagination";
import WorkspaceToolbar from "./WorkspaceToolbar";

const WorkspaceConsole = ({
  selectedWorkspace,
  setSelectedWorkspace,
}: WorkspaceConsoleProps) => {
  const theme = useTheme();
  const isXL = useMediaQuery(theme.breakpoints.up("xl"));
  const isMD = useMediaQuery(theme.breakpoints.only("md"));
  const workspaceId = selectedWorkspace?.workspaceId;
  const workspaceName = selectedWorkspace?.name;
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [search, setSearch] = useState("");
  const [matchMode, setMatchMode] = useState<"AND" | "OR">("OR");
  const [tagOnly, setTagOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "Date created" | "Date updated" | "Alphabetically"
  >("Date created");
  const debouncedSearch = useDebounce(search, 350);
  const limit =
    viewMode === "list" && isXL
      ? 7
      : viewMode === "list" && isMD
        ? 6
        : viewMode === "grid" && isXL
          ? 8
          : 5;
  const { data } = useGetWorkspaceSurveysQuery(
    {
      workspaceId,
      page,
      limit,
      search: debouncedSearch,
      matchMode,
      tagOnly,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !workspaceId,
    }
  );

  const surveys = data?.surveys || [];
  const total = data?.totalCount || 0;

  const sortedSurveys = useMemo(() => {
    if (!Array.isArray(surveys)) return [];

    switch (sortBy) {
      case "Date created":
        return [...surveys].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "Date updated":
        return [...surveys].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "Alphabetically":
        return [...surveys].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return surveys;
    }
  }, [data?.surveys, sortBy, workspaceId]);

  useEffect(() => {
    if (workspaceId) {
      setPage(1);
      setSearch("");
    }
  }, [workspaceId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        margin: "auto",
        marginTop: { md: "8%", lg: "0%", xl: "0%" },
        width: { md: "100%", lg: "98%", xl: "98%" },
        height: { md: "80%", lg: "98%", xl: "98%" },
        // border: "2px solid blue",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          width: "100%",
          height: { md: "16%", lg: "16%", xl: "12%" },
          // border: "2px solid green",
        }}
      >
        <WorkspaceToolbar
          workspaceId={workspaceId!}
          workspaceName={workspaceName}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          search={search}
          setSearch={(query) => {
            setSearch(query);
            setPage(1);
          }}
          matchMode={matchMode}
          setMatchMode={setMatchMode}
          tagOnly={tagOnly}
          setTagOnly={setTagOnly}
          total={total}
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          width: "100%",
          height: { md: "68%", lg: "68%", xl: "80%" },
          // border: "2px solid red",
        }}
      >
        <SurveysCollection
          key={workspaceId}
          surveys={sortedSurveys}
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          viewMode={viewMode}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          width: "100%",
          height: "12%",
          // border: "2px solid red",
        }}
      >
        <Grow
          in={total > 8 || search.trim().length > 0}
          timeout={300}
          unmountOnExit
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "52px",
              padding: "4px",
              // border: "2px solid green",
            }}
          >
            <WorkspaceSurveysPagination
              page={page}
              limit={limit}
              total={total}
              onPageChange={(newPage) => setPage(newPage)}
              viewMode={viewMode}
            />
          </Box>
        </Grow>
      </Box>
    </Box>
  );
};

export default WorkspaceConsole;
