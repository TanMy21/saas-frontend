import { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
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

  const { workspaceId } = useParams();

  useEffect(() => {
    if (workspaces?.length > 0) {
      const defaultWorkspaceId = workspaces[0].workspaceId;
      const targetWorkspaceId = workspaceId || defaultWorkspaceId;

      navigate(`/dash/w/${targetWorkspaceId}`, { replace: true });
    }
  }, [workspaces, navigate, workspaceId]);

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
            {workspaces?.map((workspace) => {
              const match =
                location.pathname === `/dash/w/${workspace?.workspaceId}`;
              return (
                <ListItem key={workspace?.workspaceId} disablePadding>
                  <ListItemButton sx={{ padding: "0px", marginBottom: "4px" }}>
                    <NavLink
                      to={`/dash/w/${workspace?.workspaceId}`}
                      className={({ isActive }) => (isActive ? "active" : "")}
                      style={({ isActive /*isPending, isTransitioning*/ }) => {
                        return {
                          display: "block",
                          width: "100%",
                          height: "32px",
                          padding: "8px",
                          color: isActive ? "#4C6FFF" : "#425466",
                          fontWeight: 900,
                          fontSize: "14px",
                          fontFamily:
                            "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                          lineHeight: "20px",
                          textDecoration: "none",
                          textOverflow: "ellipsis",
                          // backgroundColor: isActive ? "#E4E2E2" : "",
                          borderLeft: isActive ? "5px solid #4C6FFF" : "",
                        };
                      }}
                    >
                      <Box
                        component="main"
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "1%",
                            fontWeight: 900,
                          }}
                        >
                          {workspace?.name}
                        </Box>
                        {match && (
                          <WorkspaceSurveysListCount
                            workspaceId={workspace?.workspaceId}
                          />
                        )}
                      </Box>
                    </NavLink>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Divider />
        </Box>
      </Grid>
    </>
  );
};

export default Workspaces;
