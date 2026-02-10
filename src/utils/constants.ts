import { CreditCard, Shield, User } from "lucide-react";

import { NotificationSettings, TabId } from "./types";

export const LAST_WS_KEY = "lWSID";

export const VIEW_MODE_KEY = "ws:vm";

export const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "general", label: "General", icon: User },
  { id: "security", label: "Security", icon: Shield },
  // { id: "notifications", label: "Notifications", icon: Bell },
  { id: "subscription", label: "Subscription", icon: CreditCard },
];

export const LABELS: Record<
  keyof NotificationSettings,
  { title: string; desc: string }
> = {
  emailNotifications: {
    title: "Email Notifications",
    desc: "Receive notifications via email",
  },
  pushNotifications: {
    title: "Push Notifications",
    desc: "Receive push notifications in your browser",
  },
  marketingEmails: {
    title: "Marketing Emails",
    desc: "Receive promotional emails and updates",
  },
  securityAlerts: {
    title: "Security Alerts",
    desc: "Important security notifications",
  },
};

// multiple choice chart row height
export const ROW_HEIGHT = 44;

// Colors for multiple choice options
export const OPTION_COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#0288d1",
  "#d32f2f",
  "#9c27b0",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#0284c7",
];

// Colors for numeric distribution bars
export const BAR_COLORS = [
  "#1976D2",
  "#2E7D32",
  "#ED6C02",
  "#0288D1",
  "#D32F2F",
  "#9C27B0",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#0284C7",
];

// Ranking chart row height
export const ROW_HEIGHT_RANK = 48;

// Minimum bar percentage to ensure visibility (ranking chart)
export const MIN_BAR_PERCENT = 8;

// Color for ranking chart bars
export const BAR_COLOR = "#1976d2"; // primary

// Medal colors for top 3 ranks
export const medalColors = [
  "#ed6c02", // gold
  "#9e9e9e", // silver
  "#8d6e63", // bronze
];

// Row height for scale chart
export const ROW_HEIGHT_SCALE = 36;

// 10 rating colors
export const RATING_COLORS = [
  "#1976D2",
  "#2E7D32",
  "#ED6C02",
  "#0288D1",
  "#D32F2F",
  "#9C27B0",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#0284C7",
];

// For single choice charts
export const MAX_OPTIONS = 10;
export const ROW_HEIGHT_SINGLE_CHOICE = 40;

export const OPTION_COLORS_SINGLE_CHOICE = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#0288d1",
  "#d32f2f",
  "#9c27b0",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#0284c7",
];

// date picker styles
export const filterInputSx = {
  height: 40,
  px: 2,
  borderRadius: 2,
  mb: 1,
  backgroundColor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  // keep hover subtle
  "&:hover": {
    backgroundColor: "action.hover",
  },

  // focus state (soft, not form-like)
  "&.Mui-focused": {
    boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
  },

  // input text
  "& input": {
    fontSize: 16,
    fontWeight: 500,
  },
};
