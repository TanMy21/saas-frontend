 
import { styled } from "@mui/material/styles";
import { Separator } from "react-resizable-panels";

export const SurveyBuilderResizeHandle = styled(Separator)(() => ({
  position: "relative",
  width: 12,
  backgroundColor: "#F8FAFC",
  cursor: "col-resize",
  outline: "none",
  transition: "background-color 160ms ease",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 1,
    transform: "translateX(-50%)",
    backgroundColor: "#E2E8F0",
    transition: "background-color 160ms ease, width 160ms ease",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 6,
    height: 30,
    transform: "translate(-50%, -50%)",
    borderRadius: 999,
    backgroundImage:
      "radial-gradient(circle, #94A3B8 1.5px, transparent 1.6px)",
    backgroundPosition: "center",
    backgroundSize: "6px 7px",
    backgroundRepeat: "repeat-y",
    transition: "background-color 160ms ease",
  },
  "&:hover, &[data-separator='active'], &[data-separator='focus']": {
    backgroundColor: "#F1F5F9",
  },
  "&:hover::before, &[data-separator='active']::before, &[data-separator='focus']::before": {
    backgroundColor: "#CBD5E1",
  },
  "&:hover::after, &[data-separator='active']::after, &[data-separator='focus']::after": {
    backgroundImage:
      "radial-gradient(circle, #64748B 1.5px, transparent 1.6px)",
  },
}));