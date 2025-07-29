import { useEffect, useState } from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import { logOut } from "../app/slices/authSlice";
import { useGetMeQuery } from "../app/slices/userApiSlice";
import { useAppDispatch } from "../app/typedReduxHooks";
import usePersist from "../hooks/persist";
import { useAppTheme } from "../theme/useAppTheme";

const HeaderIconMenu = () => {
  const { brand, borders } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [persist, setPersist] = usePersist();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { data: user } = useGetMeQuery("User");

  const { email, firstname } = user || {};

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [sendLogout, { isSuccess: isSuccessLogout }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccessLogout) navigate("/");
  }, [isSuccessLogout, navigate]);

  const onLogoutClick = () => {
    handleClose();
    setPersist(false);
    dispatch(logOut());

    // setTimeout(() => {
    sendLogout();
    navigate("/?logout=success");
    // }, 1000);
  };

  const onSettingsClick = () => {
    handleClose();
    navigate("/a/settings");
  };

  const onDashboardClick = () => {
    handleClose();
    navigate("/dash");
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: borders.avatarIcon,
          transition: "border 0.2s ease",
          "&:hover": {
            border: borders.avatarIconHovered,
          },
        }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: brand.avatarBg1,
            color: brand.avatarTxt1,
            fontWeight: "bold",
            fontSize: "0.875rem",
          }}
        >
          {email?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "hidden",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 0,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 12,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Box display={"flex"}>
            <Box mt={1}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: brand.avatarBg1,
                  color: brand.avatarTxt1,
                }}
              >
                {email?.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
            <Box ml={2}>
              <Box>
                <Typography
                  sx={{ color: "black", fontWeight: "bold", fontSize: "16px" }}
                >
                  {firstname}
                </Typography>
              </Box>
              <Box sx={{ fontSize: "12px" }}>{email}</Box>
            </Box>
          </Box>
        </MenuItem>
        <Divider />
        <Box>
          <Typography
            ml={2}
            sx={{ color: "black", fontWeight: "bold", fontSize: "12px" }}
          >
            ACCOUNT
          </Typography>
        </Box>
        <MenuItem onClick={onSettingsClick}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              fontSize: "12px",
              fontWeight: "bold",
              color: "#333B70",
            }}
          >
            <SettingsIcon sx={{ color: "#A0A7B2" }} />
            Your Settings
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={onDashboardClick}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 1,
            fontSize: "12px",
            fontWeight: "bold",
            color: "#333B70",
          }}
        >
          <SpaceDashboardIcon sx={{ color: "#A0A7B2" }} />
          Dashboard
        </MenuItem>
        <MenuItem
          onClick={onLogoutClick}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 1,
            fontSize: "12px",
            fontWeight: "bold",
            color: "red",
          }}
        >
          <LogoutIcon sx={{ color: "red", ml: 0.2 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default HeaderIconMenu;
