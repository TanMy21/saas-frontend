import { useEffect, useState } from "react";

import { Box, Divider, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";

import { useGetMeQuery } from "../app/slices/userApiSlice";
import { getGreeting } from "../utils/formatDate";
import { DashBoardHeaderProps } from "../utils/types";

import HeaderIconMenu from "./HeaderIconMenu";
import WorkspacesDropDownMenu from "./Workspaces/WorkspacesDropDownMenu";

export const DashBoardHeader = ({
  selectedWorkspace,
  setSelectedWorkspace,
  setNewWorkspaceModalOpen,
  setRenameWorkspaceModalOpen,
  setDeleteWorkspaceModalOpen,
}: DashBoardHeaderProps) => {
  const [greeting, setGreeting] = useState(getGreeting());

  const { data: user } = useGetMeQuery("User");

  const { firstname } = user || {};

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        m: "0px",
        bgcolor: "white",
        borderBottom: 1,
        borderColor: "#EDEDED",
        width: "100%",
        height: "48px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "auto",
          width: "80%",
          height: "98%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 1,
            width: { lg: "64%", xl: "36%" },
            height: "96%",
            // border: "2px solid blue",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: "#332C49",
              padding: "8px",
            }}
            ml={2}
          >
            {`${greeting}, ${firstname}`}
          </Typography>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ backgroundColor: "#E2E5E9" }}
          />
          <WorkspacesDropDownMenu
            selectedWorkspace={selectedWorkspace}
            setSelectedWorkspace={setSelectedWorkspace}
            setNewWorkspaceModalOpen={setNewWorkspaceModalOpen}
            setRenameWorkspaceModalOpen={setRenameWorkspaceModalOpen}
            setDeleteWorkspaceModalOpen={setDeleteWorkspaceModalOpen}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "10%",
            height: "96%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "40%",
              height: "100%",
            }}
          >
            <HeaderIconMenu />
          </Box>
        </Box>
      </Box>
    </AppBar>
  );
};

export const SettingsPageHeader = () => {
  const [greeting, setGreeting] = useState(getGreeting());

  const { data: user } = useGetMeQuery("User");

  const { firstname } = user || {};

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        m: "0px",
        bgcolor: "white",
        borderBottom: 1,
        borderColor: "#EDEDED",
        width: "100%",
        height: "48px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "auto",
          width: "80%",
          height: "98%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 1,
            width: { lg: "64%", xl: "36%" },
            height: "96%",
            // border: "2px solid blue",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: "#332C49",
              padding: "8px",
            }}
            ml={2}
          >
            {`${greeting}, ${firstname}`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "10%",
            height: "96%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "40%",
              height: "100%",
            }}
          >
            <HeaderIconMenu />
          </Box>
        </Box>
      </Box>
    </AppBar>
  );
};
