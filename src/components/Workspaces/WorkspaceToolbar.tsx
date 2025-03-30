import { useEffect, useState } from "react";

import { Box, TextField, Typography } from "@mui/material";

import { useUpdateWorkspaceNameMutation } from "../../app/slices/workspaceApiSlice";
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
  setSearch,
  selectedWorkspace,
}: WorkspaceToolbarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(workspaceName);
  const [updateWorkspaceName] = useUpdateWorkspaceNameMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    updateWorkspaceName({ workspaceId, name: text });
    setIsEditing(false);
  };

  useEffect(() => {
    setText(workspaceName);
  }, [workspaceName]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "auto",
        marginTop: { lg: "0%" },
        width: "100%",
        height: "10%",
        // border: "2px solid green",
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
          alignItems: "center",
          gap: 2,
          width: "48%",
          height: "98%",
          // border: "2px solid green",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "98%",
            height: "48px",
            margin: "auto",
            gap: 2,
          }}
        >
          <SurveySearchBar search={search} setSearch={setSearch} />
          <SurveysViewModeToggle
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          {sortBy && setSortBy && (
            <SurveySorter sortBy={sortBy} setSortBy={setSortBy} />
          )}
        </Box>
        {/* <CreateNewSurveyBtn /> */}
      </Box>
    </Box>
  );
};

export default WorkspaceToolbar;
