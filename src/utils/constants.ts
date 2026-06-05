import {
  CheckCircle,
  Clock,
  CreditCard,
  Gem,
  Eye,
  EyeOff,
  Hand,
  Pause,
  PauseCircle,
  Play,
  RotateCcw,
  Shield,
  TimerOff,
  User,
  UserPlus,
  LockOpenIcon,
  TrendingUpIcon,
} from "lucide-react";

import { FeedbackTypeUI } from "../types/feedBackTypes";
import { LoaderMode } from "../types/modalTypes";
import { TimedChoiceSettingsForm } from "../types/surveyBuilderTypes";

import { NotificationSettings, QuestionType, TabId } from "./types";

export const LAST_WS_KEY = "lWSID";

export const VIEW_MODE_KEY = "ws:vm";
export const SETTINGS_TAB_KEY = "set:lat";

export const MAX_DROPDOWN_OPTIONS = 100;
export const DROPDOWN_WARNING_COUNT = 30;

export const MAX_TIMED_CHOICE_OPTIONS = 2;
export const DEFAULT_TIMER_SECONDS = 3;

export const MAX_CONCEPT_ATTRIBUTES = 10;
export const MIN_RECOMMENDED_ATTRIBUTES = 4;

export const MAX_TIMED_OPTION_LENGTH = 80;

export const MAX_IAT_CATEGORY_LABEL_LENGTH = 40;

export const MAX_IAT_STIMULI = 10;

export const MIN_RECOMMENDED_IAT_STIMULI = 8;

export const DEFAULT_TIMED_CHOICE_CONFIG: TimedChoiceSettingsForm = {
  timeLimitSeconds: 3,
  showCountdown: true,
  autoAdvanceOnAnswer: true,
  allowTimeout: true,
};

export const DEFAULT_IAT_PREVIEW = {
  targetA: "Brand A",
  targetB: "Brand B",
  attributeA: "Premium",
  attributeB: "Cheap",
  stimulus: "Luxury",
};

export const RICH_TEXT_FONT_SIZE_OPTIONS = [
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
  { label: "28", value: "28px" },
  { label: "32", value: "32px" },
  { label: "36", value: "36px" },
  { label: "40", value: "40px" },
  { label: "44", value: "44px" },
  { label: "48", value: "48px" },
  { label: "52", value: "52px" },
  { label: "56", value: "56px" },
  { label: "60", value: "60px" },
  { label: "64", value: "64px" },
];

export const RICH_TEXT_FONT_FAMILY_OPTIONS = [
  { label: "Inter", value: "Inter" },
  { label: "Arial", value: "Arial" },
  { label: "Helvetica", value: "Helvetica" },
  { label: "Verdana", value: "Verdana" },
  { label: "Tahoma", value: "Tahoma" },
  { label: "Trebuchet", value: "Trebuchet MS" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times", value: "Times New Roman" },
  { label: "Garamond", value: "Garamond" },
  { label: "Palatino", value: "Palatino Linotype" },
  { label: "Courier", value: "Courier New" },
  { label: "Lucida Console", value: "Lucida Console" },
  { label: "Monaco", value: "Monaco" },
  { label: "Comic Sans", value: "Comic Sans MS" },
  { label: "Impact", value: "Impact" },
  { label: "Segoe UI", value: "Segoe UI" },
];

export const CONCEPT_FIT_DISPLAY_MODE_OPTIONS = [
  { label: "Text only", value: "TEXT" },
  { label: "Image only", value: "IMAGE" },
  // { label: "Text + image", value: "TEXT_IMAGE" },
] as const;

export const CONCEPT_FIT_IMAGE_ROLE = "CONCEPT_FIT_STIMULUS";

export const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "general", label: "General", icon: User },
  { id: "create-user", label: "Add Member", icon: UserPlus },
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

export const surveyStatusConfig = {
  PAUSED: {
    label: "Paused",
    icon: PauseCircle,
    sx: {
      color: "#92400E",
      bgcolor: "#FEF3C7",
      borderColor: "#F59E0B",
    },
  },
  ACTIVE: {
    label: "Active",
    icon: Clock,
    sx: {
      color: "#1E3A8A",
      bgcolor: "#DBEAFE",
      borderColor: "#3B82F6",
    },
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle,
    sx: {
      color: "#065F46",
      bgcolor: "#D1FAE5",
      borderColor: "#10B981",
    },
  },
} as const;

export const behaviorEventConfig = {
  QUESTION_STARTED: {
    icon: Play,
    label: "Question Started",
    sx: { bgcolor: "#2563EB", color: "#FFFFFF" },
  },
  FIRST_INTERACTION: {
    icon: Hand,
    label: "First Interaction",
    sx: { bgcolor: "#0EA5E9", color: "#FFFFFF" },
  },
  HESITATION: {
    icon: Pause,
    label: "Hesitation",
    sx: { bgcolor: "#F59E0B", color: "#FFFFFF" },
  },
  FOCUS_LOST: {
    icon: EyeOff,
    label: "Lost Focus",
    sx: { bgcolor: "#F97316", color: "#FFFFFF" },
  },
  FOCUS_GAINED: {
    icon: Eye,
    label: "Regained Focus",
    sx: { bgcolor: "#10B981", color: "#FFFFFF" },
  },
  BACKTRACKED: {
    icon: RotateCcw,
    label: "Backtracked",
    sx: { bgcolor: "#8B5CF6", color: "#FFFFFF" },
  },
  ANSWERED: {
    icon: CheckCircle,
    label: "Answered",
    sx: { bgcolor: "#16A34A", color: "#FFFFFF" },
  },
  IDLE: {
    icon: TimerOff,
    label: "Idle",
    sx: { bgcolor: "#6B7280", color: "#FFFFFF" },
  },
} as const;

export enum GenerateSurveyState {
  INITIAL_CONFIG = "INITIAL_CONFIG",
  TOOLS = "TOOLS",
  APPEND_CONFIG = "APPEND_CONFIG",
  REPLACE_CONFIRM = "REPLACE_CONFIRM",
  LOADING = "LOADING",
}

export const loaderMessages: Record<LoaderMode, string[]> = {
  INITIAL: [
    "Analyzing your input...",
    "Designing question structure...",
    "Generating your survey...",
    "Finalizing survey setup...",
  ],

  APPEND: [
    "Reviewing existing questions...",
    "Generating additional questions...",
    "Integrating new questions...",
    "Updating survey flow...",
  ],

  REPLACE: [
    "Preparing to replace questions...",
    "Generating a new question set...",
    "Rebuilding survey structure...",
    "Finalizing replacement...",
  ],
};

export const loaderTitles: Record<LoaderMode, string> = {
  INITIAL: "Generating your survey...",
  APPEND: "Adding questions to your survey...",
  REPLACE: "Replacing your survey questions...",
};

export const nonOrderableTypes = [
  "WELCOME_SCREEN",
  "END_SCREEN",
  "INSTRUCTIONS",
  "EMAIL_CONTACT",
];

export const elementStartTypes = [
  "WELCOME_SCREEN",
  "INSTRUCTIONS",
  "EMAIL_CONTACT",
];

export const orderedElementTypes = [
  "BINARY",
  "MEDIA",
  "MULTIPLE_CHOICE",
  "NUMBER",
  "RADIO",
  "RANGE",
  "RANK",
  "TEXT",
  "THREE_D",

  // New ordered types.
  "DROPDOWN",
  "TIMED_CHOICE",
  "CONCEPT_FIT",
  "IAT",
  "INFO_SCREEN",
];

export const OPTION_TYPES: QuestionType[] = [
  "BINARY",
  "DROPDOWN",
  "MULTIPLE_CHOICE",
  "RADIO",
  "MEDIA",
  "THREE_D",
  "RANK",
  "TIMED_CHOICE",
  "CONCEPT_FIT",
];

export const SINGLE_VALUE_TYPES: QuestionType[] = ["TEXT", "NUMBER", "RANGE"];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const roles = {
  ADMIN: {
    label: "Admin",
    description: "Full access except ownership",
  },
  // EDITOR: {
  //   label: "Editor",
  //   description: "Can create and edit surveys",
  // },
  ANALYST: {
    label: "Analyst",
    description: "Can view analytics only",
  },
  VIEWER: {
    label: "Viewer",
    description: "Read-only access",
  },
};

export const ARCHIVE_WORKSPACE = {
  workspaceId: "ARCHIVED",
  name: "Archived",
  isVirtual: true,
};

export const FeedBackPlaceholders: Record<
  FeedbackTypeUI,
  { title: string; description: string }
> = {
  "Feature request": {
    title: "What would you like to see?",
    description: "Describe the feature and how it would help you...",
  },
  Bug: {
    title: "What’s not working?",
    description: "What happened? What did you expect instead?",
  },
  Complaint: {
    title: "What’s bothering you?",
    description: "Tell us what went wrong or frustrated you...",
  },
  General: {
    title: "Share your thoughts",
    description: "Anything you’d like to tell us...",
  },
};

export const FeedbackTypeStyles = {
  "Feature request": {
    color: "#2563eb",
    bg: "#eff6ff",
    hoverBg: "#dbeafe",
    selectedBg: "#2563eb",
  },
  Bug: {
    color: "#dc2626",
    bg: "#fef2f2",
    hoverBg: "#fee2e2",
    selectedBg: "#dc2626",
  },
  Complaint: {
    color: "#f59e0b",
    bg: "#fffbeb",
    hoverBg: "#fef3c7",
    selectedBg: "#f59e0b",
  },
  General: {
    color: "#0f766e",
    bg: "#ecfeff",
    hoverBg: "#cffafe",
    selectedBg: "#0f766e",
  },
};

export const tierConfig = {
  FREE: {
    label: "Free",
    Icon: LockOpenIcon,
    gradient: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
    textColor: "#6b7280",
    action: "Upgrade",
  },
  PROFESSIONAL: {
    label: "Pro",
    Icon: Gem,
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    textColor: "#ffffff",
    action: null,
  },
  ENTERPRISE: {
    label: "Enterprise",
    Icon: TrendingUpIcon,
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    textColor: "#ffffff",
    action: null,
  },
} as const;

// 3D interaction areas colors
export const THREE_D_AREA_COLORS = [
  "#2563EB", // blue
  "#A855F7", // purple
  "#F97316", // orange
  "#10B981", // green
  "#EC4899", // pink
  "#EAB308", // yellow
  "#06B6D4", // cyan
  "#EF4444", // red
];

export const NON_NUMBERED_ELEMENT_TYPES = [
  "WELCOME_SCREEN",
  "INSTRUCTIONS",
  "EMAIL_CONTACT",
  "END_SCREEN",
  "INFO_SCREEN",
] as const;
