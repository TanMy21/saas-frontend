import { styled, Switch } from "@mui/material";

export const CustomToggle = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 26,
  padding: 0,

  "& .MuiSwitch-switchBase": {
    padding: 3,
    transitionDuration: "200ms",

    "&.Mui-checked": {
      transform: "translateX(18px)",
      color: "#fff",

      "& + .MuiSwitch-track": {
        backgroundColor: "#2563eb",
        opacity: 1,
      },
    },
  },

  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 20,
    height: 20,
    borderRadius: "50%",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },

  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#e5e7eb",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 200,
    }),
  },
}));
