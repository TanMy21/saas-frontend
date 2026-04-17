import { useEffect, useState } from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import { Avatar, Box, Divider, IconButton, Menu } from "@mui/material";
import { CreditCardIcon, MessageSquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import { logOut } from "../app/slices/authSlice";
import { openFeedbackModal } from "../app/slices/feedbackSlice";
import { useGetMeQuery } from "../app/slices/userApiSlice";
import { useAppDispatch } from "../app/typedReduxHooks";
import usePersist from "../hooks/persist";
import { useAppTheme } from "../theme/useAppTheme";
import { Tier } from "../types/userTypes";
import { tierConfig } from "../utils/constants";

import { AccountMenuItem } from "./MenuComponents/AccountMenuItem";
import { AccountProfileSection } from "./MenuComponents/AccountProfileSection";

const HeaderIconMenu = () => {
  const { brand, borders } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [persist, setPersist] = usePersist();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { data: user } = useGetMeQuery("User");

  const { email, firstname, tier } = user || {};

  const currentTier = tierConfig[(tier as Tier) ?? "FREE"];
  const IconComponent = currentTier.Icon;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [sendLogout, { isSuccess: isSuccessLogout }] = useSendLogoutMutation();

  const onLogoutClick = async () => {
    handleClose();
    setPersist(false);
    try {
      await sendLogout().unwrap();
    } catch (err) {
      console.error(err);
    }

    dispatch(logOut());

    window.location.href = "/login?session=expired";
  };

  const onSettingsClick = () => {
    handleClose();
    navigate("/a/settings");
  };

  const onDashboardClick = () => {
    handleClose();
    navigate("/dash");
  };

  useEffect(() => {
    if (isSuccessLogout) navigate("/?logout=success");
  }, [isSuccessLogout, navigate]);

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
            width: 260,
            borderRadius: "16px",
            overflow: "hidden",
            mt: 1.5,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: `
                  0px 10px 30px rgba(0,0,0,0.08),
                    0px 2px 8px rgba(0,0,0,0.04)
                `,
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(255,255,255,0.95)",
            py: 1,
            "& .MuiMenuItem-root": {
              borderRadius: "10px",
              mx: 1,
            },
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 0,
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 16,
              width: 12,
              height: 12,
              backgroundColor: "rgba(255,255,255,0.95)",
              transform: "translateY(-50%) rotate(45deg)",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              borderLeft: "1px solid rgba(0,0,0,0.06)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Profile */}
        <AccountProfileSection
          firstname={firstname}
          email={email}
          brand={brand}
        />

        <Divider />

        {/*  Items */}
        <AccountMenuItem
          icon={<SettingsIcon sx={{ color: "#A0A7B2" }} />}
          label="Your Settings"
          onClick={onSettingsClick}
        />

        <AccountMenuItem
          icon={<CreditCardIcon style={{ color: "#A0A7B2" }} />}
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {/* Left text */}
              <Box>Plan</Box>

              {/* Right side */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 0.8,
                    borderRadius: "999px",
                    fontSize: "10px", // 🔥 reduce slightly (important)
                    fontWeight: 600,
                    background: currentTier.gradient,
                    color: currentTier.textColor,
                  }}
                >
                  <IconComponent fontSize="small" size={14} />
                  {currentTier.label}
                </Box>

                {currentTier.action && (
                  <Box
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#6366f1",

                      ml: 0.5,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {currentTier.action}
                  </Box>
                )}
              </Box>
            </Box>
          }
          onClick={() => {
            handleClose();
          }}
        />

        <Divider />

        <AccountMenuItem
          icon={<SpaceDashboardIcon sx={{ color: "#A0A7B2" }} />}
          label="Dashboard"
          onClick={onDashboardClick}
        />

        <AccountMenuItem
          icon={<MessageSquarePlus style={{ color: "#A0A7B2" }} />}
          label="Feedback"
          onClick={() => {
            handleClose();
            dispatch(openFeedbackModal());
          }}
        />
        <Divider />
        <AccountMenuItem
          icon={<LogoutIcon sx={{ color: "red", ml: 0.2 }} />}
          label="Logout"
          onClick={onLogoutClick}
          danger
        />
      </Menu>
    </>
  );
};

export default HeaderIconMenu;
