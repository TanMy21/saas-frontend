import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
import {
  useGetWorkspaceSurveysQuery,
  useUpdateWorkspaceNameMutation,
} from "../app/slices/workspaceApiSlice";
import notFound from "../assets/notFound2.svg";
import CreateNewSurveyBtn from "./CreateNewSurveyBtn";
import { useEffect, useState } from "react";
import WorkspaceDropDown from "./WorkspaceDropDownMenu";
import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";
import ListIcon from "@mui/icons-material/List";
import GridViewIcon from "@mui/icons-material/GridView";

const SurveysListMain = () => {
  let { workspaceId } = useParams();
  const { workspaces } = useOutletContext();

  const { data: surveys } = useGetWorkspaceSurveysQuery(workspaceId);

  const [updateWorkspaceName] = useUpdateWorkspaceNameMutation();

  const [sortBy, setSortBy] = useState("Date created");
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

  console.log("SurveysListMain: ", surveys);

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
                  // value={alignment}
                  exclusive
                  onChange={handleChange}
                  aria-label="Platform"
                >
                  <ToggleButton
                    size="small"
                    value="list"
                    sx={{ textTransform: "capitalize" }}
                  >
                    <ListIcon />
                    <span> List</span>
                  </ToggleButton>
                  <ToggleButton
                    size="small"
                    value="grid"
                    sx={{ textTransform: "capitalize" }}
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
              <Grid item sx={{ width: "400", height: "400" }}>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyItems={"center"}
                  alignItems={"center"}
                  sx={{
                    width: "80vw",
                    height: "72vh",
                  }}
                >
                  <Box
                    sx={{
                      width: "80%",
                      height: "88%",
                    }}
                  >
                    <Box mt={2}>
                      <Typography
                        variant="h5"
                        align="center"
                        sx={{
                          fontSize: "24px",
                          fontWeight: "200",
                          fontFamily: "Roboto",
                        }}
                      >
                        No forms are visible
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      justifyItems={"center"}
                      alignItems={"center"}
                      mt={1}
                    >
                      <CreateNewSurveyBtn />
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      justifyItems={"center"}
                      alignItems={"center"}
                      mt={1}
                    >
                      <Box
                        component={"img"}
                        src={notFound}
                        alt="No record found"
                        sx={{
                          width: "50%",
                          height: "40%",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ) : (
              surveys?.map((survey) => (
                <Grid item xs={2} sm={4} md={4} key={survey.surveyID}>
                  <Card sx={{ width: "180px", height: "210px" }}>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyItems: "center",
                        marginBottom: "24%",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: "90%",
                          height: "80%",
                          border: "2px solid black",
                        }}
                        mt={8}
                      >
                        <Typography sx={{ fontSize: "12px" }} noWrap>
                          {survey.title}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"space-between"}
                    >
                      <Box p={"6px"} mt={1} pl={1}>
                        <Typography sx={{ fontSize: "12px" }}>
                          No Responses
                        </Typography>
                      </Box>
                      <Box>
                        <CardActions>
                          <SurveyCardDropDownMenu survey={survey} />
                        </CardActions>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
      {/* <Outlet /> */}
    </>
  );
};

export default SurveysListMain;
