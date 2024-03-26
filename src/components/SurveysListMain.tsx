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
  SelectChangeEvent,
} from "@mui/material";
import { useLocation, useOutletContext, useParams } from "react-router-dom";
import {
  useGetWorkspaceSurveysQuery,
  useUpdateWorkspaceNameMutation,
} from "../app/slices/workspaceApiSlice";
import CreateNewSurveyBtn from "./CreateNewSurveyBtn";
import { useEffect, useState } from "react";
import WorkspaceDropDown from "./WorkspaceDropDownMenu";
import ListIcon from "@mui/icons-material/List";
import GridViewIcon from "@mui/icons-material/GridView";
import ListLayout from "./ListLayout";
import GridLayout from "./GridLayout";
import SurveysNotFound from "./SurveysNotFound";
import { set } from "zod";

const SurveysListMain = () => {
  const { workspaceId } = useParams();
  const location = useLocation();
  const { workspaces } = useOutletContext();

  const { data: surveys } = useGetWorkspaceSurveysQuery(workspaceId);

  const [updateWorkspaceName] = useUpdateWorkspaceNameMutation();

  const [sortBy, setSortBy] = useState("Date created");
  const [layout, setLayout] = useState<string | null>("grid");
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const workspace = workspaces?.find(
    (item) => item.workspaceId.toString() === workspaceId
  );

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const handleLayoutChange = (
    event: React.MouseEvent<HTMLElement>,
    newLayout: string | null
  ) => {
    setLayout(newLayout);
  };

  const [text, setText] = useState(workspace?.name);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    updateWorkspaceName({ workspaceId, name: text });
    setIsEditing(false);
  };

  useEffect(() => {
    setText(workspace?.name);
  }, [workspace?.name]);

  // useEffect(() => {
  //   console.log("Survey Main: ", location.state?.layout);
  //   setLayout(location.state?.layout);
  // }, [location?.state]);

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
              <div onDoubleClick={handleDoubleClick}>
                {isEditing ? (
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{ backgroundColor: "transparent" }}
                  />
                ) : (
                  <Typography variant="h6" component="h2">
                    {workspace?.name}
                  </Typography>
                )}
              </div>
            </Box>
            <Box>
              <WorkspaceDropDown wsName={workspace?.name} />
            </Box>
          </Box>
          <Box
            component="main"
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Box>
              <CreateNewSurveyBtn />
            </Box>
            <Box
              component="main"
              display={"flex"}
              sx={{ width: "400px", height: "50px" }}
            >
              <Box sx={{ width: 150 }}>
                <FormControl fullWidth size="small">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <MenuItem value={"Date created"}>Date created</MenuItem>
                    <MenuItem value={"Date updated"}>Date updated</MenuItem>
                    <MenuItem value={"Alphabetically"}>Alphabetical</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box ml={2}>
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
                        bgcolor: "#737373", // color when button is selected (clicked)
                        color: "white",
                        "&:hover": {
                          bgcolor: "#868383", // color when button is selected and hovered over
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListIcon />
                    <span> List</span>
                  </ToggleButton>
                  <ToggleButton
                    size="small"
                    value="grid"
                    sx={{
                      textTransform: "capitalize",
                      color: "black",
                      bgcolor: "#E3E3E3",
                      "&.Mui-selected": {
                        bgcolor: "#737373", // color when button is selected (clicked)
                        color: "white",
                        "&:hover": {
                          bgcolor: "#868383", // color when button is selected and hovered over
                          color: "white",
                        },
                      },
                    }}
                  >
                    <GridViewIcon />
                    Grid
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Grid item sx={{ width: "98%", height: "72vh" }} p={1}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 8, sm: 16, md: 24 }}
          >
            {surveys?.length === 0 ? (
              <SurveysNotFound />
            ) : layout === "grid" ? (
              <Grid
                display={"flex"}
                flexDirection={"row"}
                ml={2}
                p={4}
                sx={{
                  width: "100vw",
                  minHeight: 600,
                }}
              >
                <GridLayout
                  surveys={surveys}
                  workspaceId={workspaceId}
                  layout={layout}
                />
              </Grid>
            ) : (
              <Grid
                p={4}
                sx={{
                  width: "100vw",
                  minHeight: "72vh",
                  maxHeight: "80vh",
                }}
              >
                <ListLayout
                  surveys={surveys}
                  workspaceId={workspaceId}
                  layout={layout}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SurveysListMain;
