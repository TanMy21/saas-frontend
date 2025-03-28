import { useEffect, useMemo, useState } from "react";

import { Box, useMediaQuery, useTheme } from "@mui/material";

import { useGetWorkspaceSurveysQuery } from "../../app/slices/workspaceApiSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { WorkspaceConsoleProps } from "../../utils/types";
import SurveysCollection from "../Surveys/SurveysCollection";

import WorkspaceSurveysPagination from "./WorkspaceSurveysPagination";
import WorkspaceToolbar from "./WorkspaceToolbar";

const WorkspaceConsole = ({ selectedWorkspace }: WorkspaceConsoleProps) => {
  const theme = useTheme();
  const isXL = useMediaQuery(theme.breakpoints.up("xl"));
  const workspaceId = selectedWorkspace?.workspaceId;
  const workspaceName = selectedWorkspace?.name;
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "Date created" | "Date updated" | "Alphabetically"
  >("Date created");
  const debouncedSearch = useDebounce(search, 400);
  const limit =
    isXL && viewMode === "list" ? 7 : isXL && viewMode === "grid" ? 8 : 5;
  const { data } = useGetWorkspaceSurveysQuery(
    {
      workspaceId,
      page,
      limit,
      search: debouncedSearch,
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
        width: "98%",
        height: "98%",
        // border: "2px solid blue",
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
        selectedWorkspace={selectedWorkspace}
      />
      <SurveysCollection
        key={workspaceId}
        surveys={sortedSurveys}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        viewMode={viewMode}
      />
      <WorkspaceSurveysPagination
        page={page}
        limit={limit}
        total={total}
        onPageChange={(newPage) => setPage(newPage)}
        viewMode={viewMode}
      />
    </Box>
  );
};

export default WorkspaceConsole;
