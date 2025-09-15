import { useEffect, useMemo, useRef, useState } from "react";

import { Box, Grow, useMediaQuery, useTheme } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/query";

import { useGetWorkspaceSurveysQuery } from "../../app/slices/workspaceApiSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { useWheelPageNav } from "../../hooks/useSurveyCollectionScrollNav";
import { VIEW_MODE_KEY } from "../../utils/constants";
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
  const [viewMode, setViewMode] = useState<"list" | "grid">(() => {
    if (typeof window === "undefined") return "grid";
    const stored = window.localStorage.getItem(VIEW_MODE_KEY);
    return stored === "list" || stored === "grid" ? stored : "grid";
  });

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
      ? 6
      : viewMode === "list" && isMD
        ? 6
        : viewMode === "grid" && isXL
          ? 8
          : 5;

  const baseArgs = {
    workspaceId: workspaceId!, // assert if you already guard with skipToken below
    page,
    limit,
    matchMode,
    tagOnly,
    // ✅ only include `search` key when non-empty
    ...(debouncedSearch.trim() ? { search: debouncedSearch } : {}),
  };

  const { data } = useGetWorkspaceSurveysQuery(
    // skipSearchCall
    // ? skipToken
    // :
    // {
    //   workspaceId,
    //   page,
    //   limit,
    //   search: debouncedSearch,
    //   matchMode,
    //   tagOnly,
    // },
    workspaceId ? baseArgs : skipToken,
    {
      refetchOnMountOrArgChange: true,
      skip: !workspaceId,
    }
  );

  const surveys = data?.surveys || [];
  const total = data?.totalCount || 0;

  const totalPages = Math.ceil(total / limit);
  const pagerEnabled = totalPages > 1;

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== VIEW_MODE_KEY) return;
      const v =
        e.newValue === "list" || e.newValue === "grid" ? e.newValue : "grid";
      setViewMode(v);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const goNextPage = () => {
    setPage((p) => {
      if (p >= totalPages) return p;

      return p + 1;
    });
  };
  const goPrevPage = () => {
    setPage((p) => {
      if (p <= 1) return p;

      return p - 1;
    });
  };

  useWheelPageNav({
    containerRef,
    enabled: pagerEnabled,
    canGoPrev: page > 1,
    canGoNext: page < totalPages,
    onPrev: goPrevPage,
    onNext: goNextPage,
    cooldownMs: 600,
    wheelThreshold: 100,
    touchThreshold: 48,
  });

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
          height: { md: "16%", lg: "16%", xl: "20%" },
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
        ref={containerRef}
        sx={{
          position: "relative",
          // overflow: "hidden",
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
