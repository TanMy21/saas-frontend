import { ReactNode } from "react";

import { BarChart3, Shield, Smartphone, Users } from "lucide-react";
import { type Transition } from "motion/react";

import {
  BinaryResult,
  MediaResult,
  MultipleChoiceResult,
  NumberResult,
  RangeResult,
  RankOption,
  ResponsesSummaryQuestion,
  SingleChoiceResult,
  SummaryQuestion,
  TextResponseItem,
} from "./insightTypes";
import { EdgeStyle, LayoutMode } from "./types";

export const generateOptionLabel = (index: number, qType: string) => {
  if (qType === "RADIO" || qType === "MULTIPLE_CHOICE" || qType === "MEDIA") {
    return String.fromCharCode(65 + index);
  }
  return `${index + 1}`;
};

export const getSquareImageURL = (url: string) =>
  url.replace("/upload/", "/upload/w_250,h_250,c_fill,g_auto/");

export const features = [
  {
    id: 1,
    icon: BarChart3,
    title: "Survey Analytics",
    description:
      "Get instant insights with our advanced analytics dashboard. Track performance metrics, user behavior, and business growth in real-time.",
    image:
      "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    icon: Users,
    title: "Design",
    description:
      "Seamlessly collaborate with your team members. Share projects, assign tasks, and communicate effectively all in one place.",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    icon: Shield,
    title: "Flow",
    description:
      "Enterprise-grade security with end-to-end encryption, multi-factor authentication, and regular security audits.",
    image:
      "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 4,
    icon: Smartphone,
    title: "Mobile Optimization",
    description:
      "Access your workspace anywhere with our fully responsive design and native mobile apps for iOS and Android.",
    image:
      "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export const navItems = [
  {
    name: "Platform",
    hasDropdown: true,
    items: ["Flow", "Customize", "True Insights", "Market Research"],
  },
  {
    name: "Resources",
    hasDropdown: true,
    items: ["Press Releases", "Blog", "Events", "Webinars"],
  },
  { name: "Company", hasDropdown: false },
];

export const normalize = (s?: string | null) => (s ?? "").trim();

export const isOrderable = (type?: string, order?: number) => {
  if (!type || typeof order !== "number") return false;
  const nonOrderableTypes = [
    "WELCOME_SCREEN",
    "INSTRUCTIONS",
    "EMAIL_CONTACT",
    "END_SCREEN",
  ];
  return !nonOrderableTypes.includes(type) && order > 0 && order < 9999;
};

export const mergeHandlers =
  <E>(...handlers: Array<((e: E) => void) | undefined>) =>
  (e: E) => {
    handlers.forEach((h) => h?.(e));
  };

export const NO_CONDITION_TYPES = new Set<string>(["RANK", "END_SCREEN"]);
export const isConditionlessType = (t?: string) =>
  !!t && NO_CONDITION_TYPES.has(t);

export const LAYOUT_LABELS: Record<LayoutMode, string> = {
  sugiyama: "Horizontal",
  vertical: "Vertical",
  swimlanes: "Swimlanes",
  clustered: "Clustered",
};

export const ORDER: EdgeStyle[] = ["straight", "step", "smoothstep", "bezier"];

export const EDGE_STYLE_LABELS: Record<EdgeStyle, string> = {
  straight: "Straight",
  step: "Step",
  smoothstep: "Smooth",
  bezier: "Bezier",
};

export const popVariants = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 6, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
};

export const popTransition: Transition = { duration: 0.16, ease: "easeOut" };

export const LAYOUT_OPTIONS: LayoutMode[] = [
  "sugiyama",
  "vertical",
  "swimlanes",
  "clustered",
];
export const EDGE_OPTIONS: EdgeStyle[] = [
  "straight",
  "step",
  "smoothstep",
  "bezier",
];

export const MAX_OPTIONS = 10;

export const severitySx = (rate: number) => {
  if (rate >= 25)
    return { color: "#b91c1c", bgcolor: "#fef2f2", borderColor: "#fee2e2" };
  if (rate >= 10)
    return { color: "#b45309", bgcolor: "#fffbeb", borderColor: "#fde68a" };
  return { color: "#047857", bgcolor: "#ecfdf5", borderColor: "#a7f3d0" };
};

export const calculateDropOff = (reached: number, answered: number) => {
  const dropped = reached - answered;
  const rate = reached ? (dropped / reached) * 100 : 0;
  return { dropped, rate };
};

export const generateTrendData = (days = 30) => {
  const data = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      starts: Math.floor(40 + Math.random() * 50),
      completionRate: 65 + Math.random() * 20,
      dropOffRate: 15 + Math.random() * 10,
    });
  }

  return data;
};

export const TREND_DATA = generateTrendData();

export const getBarColor = (rate: number) => {
  if (rate >= 25) return "bg-red-500";
  if (rate >= 10) return "bg-amber-400";
  return "bg-emerald-500";
};

export const formatChartValue = (
  value: unknown,
  displayMode: "count" | "percentage",
): ReactNode => {
  // formate numbers with locale and optional % sign
  if (typeof value === "number") {
    return displayMode === "percentage"
      ? `${value.toFixed(1)}%`
      : value.toLocaleString();
  }

  if (typeof value === "string") {
    return value;
  }

  // null / undefined / objects > render nothing
  return "";
};

export const formatChartLabelValue = (
  value: unknown,
  displayMode: "count" | "percentage",
): string | number | undefined => {
  if (typeof value !== "number") return undefined;

  return displayMode === "percentage"
    ? `${value.toFixed(0)}%`
    : value.toLocaleString();
};

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let count = seconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";

  for (const [limit, nextUnit] of intervals) {
    if (count < limit) break;
    count /= limit;
    unit = nextUnit;
  }

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return rtf.format(-Math.floor(count), unit);
}

export function getCssColor(variable: string) {
  if (typeof window === "undefined") return "#000";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}

// Replacement for date-fns format(date, 'MMM d, h:mm a')

export function formatDateTime(date: Date | string): string {
  // Ensure Date instance
  const d = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat("en-US", {
    month: "short", // MMM
    day: "numeric", // d
    hour: "numeric", // h
    minute: "2-digit",
    hour12: true, // a (AM/PM)
  }).format(d);
}

export function formatResponse(
  response: unknown,
  questionType: string,
): string {
  if (response === null || response === undefined) {
    return "No Response";
  }

  if (questionType === "EMAIL_CONTACT") {
    return typeof response === "string" ? response : "";
  }

  if (questionType === "RANK" && Array.isArray(response)) {
    return [...response]
      .sort((a, b) => a.rank - b.rank)
      .map((r) => `${r.rank}. ${r.value}`)
      .join(", ");
  }

  if (
    (questionType === "MEDIA" || questionType === "MULTIPLE_CHOICE") &&
    Array.isArray(response)
  ) {
    return response.join(", ");
  }

  if (questionType === "RANGE" || questionType === "NUMBER") {
    return response.toString();
  }

  if (typeof response === "string" || typeof response === "number") {
    return response.toString();
  }

  return "";
}

export function normalizeQuestion(
  q: ResponsesSummaryQuestion,
): SummaryQuestion {
  const base = {
    questionID: q.questionID,
    order: q.order,
    text: q.text,
    meta: q.meta,
  };

  switch (q.type) {
    case "BINARY":
    case "THREE_D":
      return {
        ...base,
        type: q.type,
        result: q.result as BinaryResult,
      };

    case "RADIO":
      return {
        ...base,
        type: "RADIO",
        result: q.result as SingleChoiceResult,
      };

    case "MULTIPLE_CHOICE": {
      const result = q.result as MultipleChoiceResult;

      return {
        ...base,
        type: "MULTIPLE_CHOICE",
        result,
      };
    }

    case "MEDIA": {
      const result = q.result as MediaResult;

      return {
        ...base,
        type: "MEDIA",
        result,
      };
    }

    case "NUMBER":
      return {
        ...base,
        type: "NUMBER",
        result: q.result as NumberResult,
      };

    case "RANGE": {
      const result = q.result as RangeResult;

      return {
        ...base,
        type: "RANGE",
        result,
      };
    }

    case "RANK":
      return {
        ...base,
        type: "RANK",
        options: (q.result as { options: RankOption[] }).options,
      };

    case "TEXT": {
      const result = q.result as {
        total: number;
        page: number;
        pageSize: number;
        responses: TextResponseItem[];
      };

      return {
        ...base,
        type: "TEXT",
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        responses: result.responses,
      };
    }

    default:
      throw new Error(`Unhandled question type`);
  }
}

export function formatRangeLabel(min: number, max: number) {
  const isIntegerRange = Number.isInteger(min) && Number.isInteger(max);

  if (isIntegerRange) {
    return `${Math.round(min)}–${Math.round(max)}`;
  }

  // fallback for decimal data
  return `${min.toFixed(1)}–${max.toFixed(1)}`;
}

export function formatTimestamp(ms?: number) {
  if (!ms && ms !== 0) return "-";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatDuration(ms?: number) {
  if (!ms) return null;
  return `${(ms / 1000).toFixed(1)}s`;
}
