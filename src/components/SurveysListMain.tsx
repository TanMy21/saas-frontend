import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useGetWorkspaceSurveysQuery } from "../app/slices/workspaceApiSlice";
const SurveysListMain = () => {
  let { workspaceId } = useParams();
  const { workspaces } = useOutletContext();

  const { data: surveys } = useGetWorkspaceSurveysQuery(workspaceId);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(menuAnchor);

  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Save the changes or perform any required actions here
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = (option: string) => {
    console.log(option); // Log the option that was clicked
    setMenuAnchor(null);
  };

  const workspace = workspaces?.find(
    (item) => item.workspaceId.toString() === workspaceId
  );
  const [text, setText] = useState(workspace?.name);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  console.log("SurveysListMain: ", surveys);

  return (
    <>
      <Grid container direction={"column"} sx={{ padding: "0% 4%" }}>
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
            sx={{ width: "16%", p: 1 }}
          >
            <Box>
              <div onDoubleClick={handleDoubleClick}>
                {isEditing ? (
                  <input
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                ) : (
                  <Typography variant="h6" component="h2">
                    {workspace?.name}
                  </Typography>
                )}
              </div>
            </Box>
            <Box>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreHorizIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={menuAnchor}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={() => handleClose("Rename")}>
                  Rename
                </MenuItem>
                <Divider />
                <MenuItem
                  sx={{ color: "red" }}
                  onClick={() => handleClose("Delete")}
                >
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Link
              to="/workspace"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Button
                sx={{
                  backgroundColor: "#0068FF",
                  mr: 2,
                  textTransform: "capitalize",
                }}
                variant="contained"
                size="small"
              >
                <AddIcon />
                Create New Survey
              </Button>
            </Link>
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
              <p>No Survey</p>
            ) : (
              surveys?.map((survey) => (
                <Grid item xs={2} sm={4} md={4} key={survey.surveyID}>
                  <Card sx={{ width: "180px", height: "210px" }}>
                    <CardContent
                      sx={{
                        display: "flex",
                        marginBottom: "54%",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" noWrap>
                        {survey.title}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Box>No Responses</Box>
                      <Box>
                        <CardActions>
                          <Button>
                            <MoreHorizIcon />
                          </Button>
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
