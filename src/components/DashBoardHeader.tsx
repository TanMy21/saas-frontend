import { useEffect, useState } from "react";

import { Box, Divider, IconButton, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { ChevronLeftIcon, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const { brand, background, grey } = useAppTheme();
  const navigate = useNavigate();

  const handleNavigationBack = () => {
    navigate(-1);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: background.paper,
        borderBottom: 1,
        borderColor: brand.borderColor1,
        width: "100%",
        height: { xs: 56, sm: 56, md: 64 },
        display: "flex",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "auto",
          width: "94%",
          height: "100%",
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
        }}
      >
        {/* Left section: nav + divider + title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            onClick={handleNavigationBack}
            sx={{
              background: grey[100],
              width: 36,
              height: 36,
              borderRadius: 2,
              color: grey[931],
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
              transition: "transform 120ms ease, box-shadow 120ms ease",
              "&:hover": {
                backgroundColor: grey[100],
                transform: "translateX(-1px)",
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.10)",
              },
              "& .MuiSvgIcon-root": { fontSize: { xs: 22, md: 24 } },
            }}
          >
            <ChevronLeftIcon fontSize="medium" />
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 2, borderColor: brand.borderColor1 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Settings style={{ fontSize: 28, color: "#0F1828" }} />
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.5rem" },
                fontWeight: 600,
                color: "#0F1828",
              }}
            >
              Settings
            </Typography>
          </Box>
        </Box>

        {/* Right section: header menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <HeaderIconMenu />
        </Box>
      </Box>
    </AppBar>
  );
};
