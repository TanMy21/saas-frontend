import { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import { WorkspacesProp } from "../utils/types";
import WorkspaceSurveysListCount from "./WorkspaceSurveysListCount";
import NewWorkspaceModal from "./Modals/NewWorkspaceModal";

const Workspaces = ({ workspaces }: WorkspacesProp) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (workspaces?.length > 0) {
      const firstWorkspaceId = workspaces[0].workspaceId;
      navigate(`/dash/w/${firstWorkspaceId}`);
    }
  }, [workspaces, navigate]);

  useEffect(() => {
    navigate(location.pathname);
  }, [location.pathname, navigate]);

  return (
    <>
      <Stack>
        <Box>
          <NewWorkspaceModal />
        </Box>
        <Box sx={{ width: "100%", height: "200px" }}>
          <List>
            {workspaces?.map((workspace) => (
              <ListItem key={workspace?.workspaceId} disablePadding>
                <ListItemButton sx={{ padding: "0px", marginBottom: "4px" }}>
                  <NavLink
                    to={`/dash/w/${workspace?.workspaceId}`}
                    style={({ isActive /*isPending, isTransitioning*/ }) => {
                      return {
                        width: "100%",
                        height: "32px",
                        padding: "8px",
                        fontWeight: isActive ? "bold" : "",
                        textDecoration: "none",
                        color: "#262627",
                        fontFamily: "sans-serif",
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
                        <ListItemText
                          sx={{ fontSize: "12px" }}
                          primary={workspace?.name}
                        />
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
      </Stack>
    </>
  );
};

export default Workspaces;
