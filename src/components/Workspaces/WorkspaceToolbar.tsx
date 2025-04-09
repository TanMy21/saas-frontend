import { useEffect, useState } from "react";

import { Box, Fade, Grow, TextField, Typography } from "@mui/material";

import {
  useGetWorkspacesQuery,
  useUpdateWorkspaceNameMutation,
} from "../../app/slices/workspaceApiSlice";
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
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(workspaceName);
  const { refetch } = useGetWorkspacesQuery("workspacesList");
  const [updateWorkspaceName] = useUpdateWorkspaceNameMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = async () => {
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
          gap: 4,
          width: "48%",
          height: "98%",
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
            }}
          />
        ) : (
          <Typography
            onClick={() => setIsEditing(true)}
            variant="h4"
            component="h2"
            sx={{
              padding: "4px",
              borderRadius: "4px",
              transition: "all 0.1s ease",
              "&:hover": {
                border: "2px solid #9D9C9C",
                cursor: "pointer",
              },
            }}
          >
            {workspaceName}
          </Typography>
        )}
        <Box>
          <WorkspaceDropDown selectedWorkspace={selectedWorkspace} />
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
            <Box sx={{width: "80%", height: "100%"}}>
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
