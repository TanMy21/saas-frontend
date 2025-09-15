import { useEffect, useState } from "react";

import { Box, Divider, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";

import { useGetMeQuery } from "../app/slices/userApiSlice";
import { useAppTheme } from "../theme/useAppTheme";
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
  const { brand, textStyles } = useAppTheme();

  const [greeting, setGreeting] = useState(getGreeting());

  const { data: user } = useGetMeQuery("User");

  const { firstname } = user ?? {};

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
        borderColor: brand.borderColor1,
        width: "100%",
        height: { xs: 56, sm: 56, md: 60 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "auto",
          width: { xs: "94%", sm: "90%", md: "86%", lg: "84%", xl: "84%" },
          height: "100%",
          alignItems: "center",
          // border: "2px solid red",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 1,
            width: { md: "56%", xl: "36%" },
            height: "96%",
            // border: "2px solid blue",
          }}
        >
          <Typography
            sx={{
              ...textStyles.greetingsText,
              fontSize: { xs: "0.95rem", sm: "1rem" },
              letterSpacing: "-0.015em",
              color: "#0F1828",
            }}
            ml={{ xs: 0, sm: 1, xl: 2 }}
          >
            {`${greeting}, ${firstname}`}
          </Typography>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ backgroundColor: brand.divider2, opacity: 0.8 }}
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
              height: "100%",
              width: { xs: "100%", sm: "70%", md: "60%", lg: "48%" },
              pl: 1.5,
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
  const { textStyles, brand, background } = useAppTheme();
  const [greeting, setGreeting] = useState(getGreeting());

  const { data: user } = useGetMeQuery("User");

  const { firstname } = user ?? {};

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
        bgcolor: background.paper,
        borderBottom: 1,
        borderColor: brand.borderColor1,
        width: "100%",
        height: { xs: 56, sm: 56, md: 60 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "auto",
          width: { xs: "94%", sm: "90%", md: "86%", lg: "84%", xl: "80%" },
          height: "100%",
          alignItems: "center",
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
            sx={{
              ...textStyles.greetingsText,
              fontSize: { xs: "0.95rem", sm: "1rem" },
              letterSpacing: "-0.015em",
              color: "#0F1828",
            }}
            ml={{ xs: 0, sm: 1, xl: 2 }}
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
              height: "100%",
              width: { xs: "100%", sm: "70%", md: "60%", lg: "48%" },
              pl: 1.5,
            }}
          >
            <HeaderIconMenu />
          </Box>
        </Box>
      </Box>
    </AppBar>
  );
};
