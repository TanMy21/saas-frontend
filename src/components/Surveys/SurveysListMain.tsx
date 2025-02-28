import { useEffect, useMemo, useState } from "react";

import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import {
  Box,
  Divider,
  Grid,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";

import {
  useGetWorkspaceSurveysQuery,
  useUpdateWorkspaceNameMutation,
} from "../../app/slices/workspaceApiSlice";
import { WorkspacesProp } from "../../utils/types";
import WorkspaceDropDown from "../Workspaces/WorkspaceDropDownMenu";

import CreateNewSurveyBtn from "./CreateNewSurveyBtn";
import GridLayout from "./GridLayout";
import ListLayout from "./ListLayout";
import SurveysNotFound from "./SurveysNotFound";

const SurveysListMain = () => {
  const { workspaceId } = useParams();
  const { workspaces } = useOutletContext<WorkspacesProp>();

  const { data: surveys } = useGetWorkspaceSurveysQuery(workspaceId);

  const [updateWorkspaceName] = useUpdateWorkspaceNameMutation();

  const [sortBy, setSortBy] = useState("Date created");
  const [layout, setLayout] = useState<string | null>("grid");
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const workspace = workspaces?.find(
    (item) => item.workspaceId?.toString() === workspaceId
  );

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
  }, [surveys, sortBy]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleLayoutChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLayout: string | null
  ) => {
    setLayout(newLayout);
  };

  const [text, setText] = useState(workspace?.name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    updateWorkspaceName({ workspaceId, name: text });
    setIsEditing(false);
  };

  useEffect(() => {
    setText(workspace?.name);
  }, [workspace?.name]);

  return (
    <>
      <Grid container direction={"column"} sx={{ padding: "0% 2%" }}>
        <Grid
          item
          sx={{
            width: "98%",
            height: "100px",
            padding: "2%",
          }}
          mb={4}
        >
          <Box
            component="main"
            display={"flex"}
            justifyContent={"space-between"}
            sx={{ minWidth: "16%", maxWidth: "30%", p: 1 }}
          >
            <Box>
              <Box onDoubleClick={handleDoubleClick}>
                {isEditing ? (
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{
                      backgroundColor: "transparent",
                    }}
                  />
                ) : (
                  <Typography
                    variant="h6"
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
                    {workspace?.name}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box>
              <WorkspaceDropDown workspaceName={workspace?.name} />
            </Box>
          </Box>
          <Box
            component="main"
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Box id="new-survey-btn">
              <CreateNewSurveyBtn
                workspaceId={workspaceId}
                workspaceName={workspace?.name}
              />
            </Box>
            <Box
              component="main"
              display={"flex"}
              sx={{ width: "400px", height: "50px" }}
            >
              <Box id="sort-surveys" sx={{ width: 150 }}>
                <FormControl fullWidth size="small">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleSortChange}
                    value={sortBy}
                  >
                    <MenuItem value={"Date created"}>Date created</MenuItem>
                    <MenuItem value={"Date updated"}>Date updated</MenuItem>
                    <MenuItem value={"Alphabetically"}>Alphabetical</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box id="survey-view-layout" ml={2}>
                <ToggleButtonGroup
                  color="primary"
                  value={layout}
                  exclusive
                  onChange={handleLayoutChange}
                  aria-label="Platform"
                >
                  <ToggleButton
                    size="small"
                    value="list"
                    sx={{
                      textTransform: "capitalize",
                      color: "black",
                      bgcolor: "#E3E3E3",
                      "&.Mui-selected": {
                        bgcolor: "#5240ED", 
                        color: "white",
                        "&:hover": {
                          bgcolor: "#868383", 
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListIcon />
                  </ToggleButton>
                  <ToggleButton
                    size="small"
                    value="grid"
                    sx={{
                      textTransform: "capitalize",
                      color: "black",
                      bgcolor: "#E3E3E3",
                      "&.Mui-selected": {
                        bgcolor: "#5240ED",  
                        color: "white",
                        "&:hover": {
                          bgcolor: "#868383", 
                          color: "white",
                        },
                      },
                    }}
                  >
                    <GridViewIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Grid item sx={{ width: "98%", height: "72vh" }} p={1}>
          <Grid
            id="survey-list"
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ lg: 8, md: 6, sm: 4, xs: 2 }}
          >
            {
             
              surveys?.length === 0 ? (
                <SurveysNotFound />
              ) : layout === "grid" ? (
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  ml={2}
                  pl={4}
                  pt={4}
                  sx={{
                    width: "100%",
                    minHeight: 600,
                  }}
                >
                  <GridLayout
                    surveys={sortedSurveys}
                    workspaceId={workspaceId!}
                    workspaceName={workspace?.name!}
                    layout={layout}
                  />
                </Box>
              ) : (
                <Grid
                  container
                  display={"flex"}
                  flexDirection={"column"}
                  p={4}
                  sx={{
                    width: "100%",
                    minHeight: "72vh",
                  }}
                >
                  <ListLayout
                    surveys={sortedSurveys}
                    workspaceId={workspaceId!}
                    workspaceName={workspace?.name!}
                    layout={layout || "list"}
                  />
                </Grid>
              )
            }
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SurveysListMain;
