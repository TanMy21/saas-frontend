import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { WorkspacesProp } from "../../utils/types";
import WorkspaceSurveysListCount from "./WorkspaceSurveysListCount";
import NewWorkspaceModal from "../Modals/NewWorkspaceModal";

const Workspaces = ({ workspaces }: WorkspacesProp) => {
  const navigate = useNavigate();
  // const location = useLocation();

  useEffect(() => {
    if (workspaces?.length > 0) {
      const firstWorkspaceId = workspaces[0].workspaceId;
      navigate(`/dash/w/${firstWorkspaceId}`);
    }
  }, [workspaces, navigate]);

  // useEffect(() => {
  //   navigate(location.pathname);
  // }, [location.pathname, navigate]);

  return (
    <>
      <Grid container display={"flex"} flexDirection={"column"}>
        <Grid
          item
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"end"}
          mt={2}
          mb={2}
          sx={{
            width: "98%",
            height: "50px",
          }}
        >
          <NewWorkspaceModal />
        </Grid>

        <Box sx={{ width: "100%", minHeight: "200px", marginTop: "8%" }}>
          <List>
            {workspaces?.map((workspace) => (
              <ListItem key={workspace?.workspaceId} disablePadding>
                <ListItemButton sx={{ padding: "0px", marginBottom: "4px" }}>
                  <NavLink
                    to={`/dash/w/${workspace?.workspaceId}`}
                    style={({ isActive /*isPending, isTransitioning*/ }) => {
                      return {
                        display: "block",
                        width: "100%",
                        height: "32px",
                        padding: "8px",
                        color: isActive ? "#262626" : "#737373",
                        fontWeight: isActive ? "bold" : "",
                        fontSize: "14px",
                        fontFamily:
                          "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                        lineHeight: "20px",
                        textDecoration: "none",
                        textOverflow: "ellipsis",
                        backgroundColor: isActive ? "#E4E2E2" : "",
                      };
                    }}
                  >
                    <Box
                      component="main"
                      display={"flex"}
                      justifyContent={"space-between"}
                    >
                      <Box>
                        <ListItemText primary={workspace?.name} />
                      </Box>
                      <WorkspaceSurveysListCount
                        workspaceId={workspace?.workspaceId}
                      />
                    </Box>
                  </NavLink>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Grid>
    </>
  );
};

export default Workspaces;
