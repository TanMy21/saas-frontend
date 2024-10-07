import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import { useGetMeQuery } from "../app/slices/userApiSlice";
import usePersist from "../hooks/persist";

const HeaderIconMenu = () => {
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

  const onLogoutClicked = () => {
    handleClose();
    setPersist(false);
    sendLogout();
    navigate("/");
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            marginRight: "8px",
            backgroundColor: "#ADEBE4",
            color: "#13137F",
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
                  backgroundColor: "#ADEBE4",
                  color: "#13137F",
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
        <MenuItem onClick={handleClose}>
          <Box>
            <Box sx={{ fontSize: "12px" }}>Your Settings</Box>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} sx={{ fontSize: "12px" }}>
          Homepage
        </MenuItem>
        <MenuItem
          onClick={onLogoutClicked}
          sx={{ color: "red", fontSize: "12px" }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default HeaderIconMenu;
