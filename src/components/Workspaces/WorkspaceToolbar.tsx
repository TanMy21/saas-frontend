import { useEffect, useState } from "react";

import { Box, Grow, TextField, Tooltip, Typography } from "@mui/material";

import {
  useGetWorkspacesQuery,
  useUpdateWorkspaceNameMutation,
} from "../../app/slices/workspaceApiSlice";
import { useAppTheme } from "../../theme/useAppTheme";
import { WorkspaceToolbarProps } from "../../utils/types";
import SurveySearchBar from "../Surveys/SurveySearchBar";
import SurveySorter from "../Surveys/SurveySorter";
import SurveysViewModeToggle from "../Surveys/SurveysViewModeToggle";

import WorkspaceDropDown from "./WorkspaceDropDownMenu";

const WorkspaceToolbar = ({
  workspaceId,
  workspaceName,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  search,
  matchMode,
  setMatchMode,
  tagOnly,
  total,
  setTagOnly,
  setSearch,
  selectedWorkspace,
  setSelectedWorkspace,
}: WorkspaceToolbarProps) => {
  const { primary } = useAppTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(workspaceName);
  const { refetch } = useGetWorkspacesQuery("workspacesList");
  const [updateWorkspaceName] = useUpdateWorkspaceNameMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = async () => {
    if (text.trim() === "" || text === workspaceName) {
      setIsEditing(false);
      setText(workspaceName);
      return;
    }
    const updated = await updateWorkspaceName({
      workspaceId,
      name: text,
    }).unwrap();
    refetch();
    setIsEditing(false);

    if (selectedWorkspace?.workspaceId === updated.workspaceId) {
      setSelectedWorkspace((prev) =>
        prev ? { ...prev, name: updated.name } : prev
      );
    }
  };

  useEffect(() => {
    setText(workspaceName);
  }, [workspaceName]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "auto",
        // marginTop: { lg: "0%" },
        width: "96%",
        height: "96%",
        // border: "2px solid yellow",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: { xs: 2, md: 3, lg: 4 },
          width: "48%",
          height: "98%",
          px: { xs: 0, md: 0.5 },
          // border: "2px solid green",
        }}
      >
        {isEditing ? (
          <TextField
            id="outlined-basic"
            variant="outlined"
            type="text"
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            sx={{
              backgroundColor: "transparent",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "transparent",
                height: { xs: 44, md: 48 },
                paddingRight: 1,
                transition: "box-shadow 120ms ease, border-color 120ms ease",
                "& fieldset": { borderColor: "transparent" }, // ✨ no box until hover/focus
                "&:hover fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                "&.Mui-focused fieldset": { borderColor: "transparent" },
                "&.Mui-focused": {
                  boxShadow: `0 0 0 2px ${primary.main}33`, // ✨ soft focus ring
                },
              },
              "& .MuiInputBase-input": {
                fontWeight: 800, // ✨ title weight
                fontSize: { xs: 22, md: 26, lg: 28 },
                lineHeight: 1.2,
                paddingY: 1,
              },
            }}
          />
        ) : (
          <Tooltip title="Click to rename" arrow placement="bottom">
            <Typography
              onClick={() => setIsEditing(true)}
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 800,
                lineHeight: 1.2,
                padding: "6px 8px",
                borderRadius: 2,
                transition:
                  "background-color 120ms ease, box-shadow 120ms ease",
                cursor: "text",
                color: "#080F1F",
                // keep it on one line without jank; clip if ultra long
                display: "inline-block",
                whiteSpace: "nowrap",
                maxWidth: { xs: "70vw", lg: "32vw" }, // ✨ prevent layout break
                overflow: "hidden",
                textOverflow: "ellipsis",
                "&:hover": {
                  backgroundColor: "rgba(2,43,103,0.06)", // ✨ soft hover tint
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                },
                "&:focus": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: "2px",
                },
              }}
            >
              {workspaceName}
            </Typography>
          </Tooltip>
        )}
        <Box>
          <WorkspaceDropDown
            selectedWorkspace={selectedWorkspace}
            setSelectedWorkspace={setSelectedWorkspace}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          gap: 2,
          width: "100%",
          height: "98%",
          // border: "2px solid orange",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "16%",
            height: "60%",
            // border: "2px solid blue",
          }}
        >
          <SurveysViewModeToggle
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "64%",
            height: "72%",
            // border: "2px solid blue",
          }}
        >
          <Grow
            in={total > 8 || search.trim().length > 0}
            timeout={300}
            unmountOnExit
          >
            <Box data-ignore-pager sx={{ width: "80%", height: "100%" }}>
              <SurveySearchBar
                search={search}
                setSearch={setSearch}
                matchMode={matchMode}
                setMatchMode={setMatchMode}
                tagOnly={tagOnly}
                setTagOnly={setTagOnly}
              />
            </Box>
          </Grow>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "16%",
            height: "92%",
            // border: "2px solid blue",
          }}
        >
          {sortBy && setSortBy && (
            <SurveySorter sortBy={sortBy} setSortBy={setSortBy} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WorkspaceToolbar;
