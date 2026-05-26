import { ReactNode } from "react";

import {
  Box,
  EyeOff,
  Gauge,
  GripVertical,
  Layers,
  LineChart,
  MousePointerClick,
  Palette,
  PieChart,
  Plus,
  Image as Img,
  RotateCw,
  Sparkles,
  TrendingUp,
  Type,
  Users,
  Crosshair,
  Activity,
  CircleDot,
} from "lucide-react";
import { type Transition } from "motion/react";

import { FeatureItem, Step, UseCase } from "../types/landingTypes";

import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  OPTION_TYPES,
  SINGLE_VALUE_TYPES,
} from "./constants";
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
import { showToast } from "./showToast";
import { EdgeStyle, LayoutMode, QuestionType } from "./types";

export const generateOptionLabel = (index: number, qType: string) => {
  if (qType === "RADIO" || qType === "MULTIPLE_CHOICE" || qType === "MEDIA") {
    return String.fromCharCode(65 + index);
  }
  return `${index + 1}`;
};

export const getSquareImageURL = (url: string) =>
  url.replace("/upload/", "/upload/w_250,h_250,c_fill,g_auto/");

export const features: FeatureItem[] = [
  {
    key: "create",
    label: "Create Surveys",
    icon: Plus,
    step: "01",
    title: "Create beautiful surveys\nin minutes",
    description:
      "Build engaging surveys with our intuitive builder. Choose from various question types and customize to match your needs.",
    color: "feature-color-blue",
    bullets: [
      {
        icon: GripVertical,
        title: "Drag & drop builder",
        desc: "Create surveys effortlessly",
      },
      {
        icon: Type,
        title: "Multiple question types",
        desc: "Text, rating, choice, and more",
      },
      {
        icon: Palette,
        title: "Fully customizable",
        desc: "Match your brand and style",
      },
    ],
    cta: "Start Creating",
  },
  {
    key: "threeD",
    label: "3D Questions",
    icon: Box,
    step: "02",
    title: "Capture feedback\non real 3D products",
    description:
      "Let users interact with 3D models directly inside surveys. Rotate, inspect, and respond to products like perfumes, shoes, packaging, and more.",
    color: "feature-color-violet",
    bullets: [
      {
        icon: RotateCw,
        title: "Interactive 3D models",
        desc: "Users can rotate, zoom, and explore freely",
      },
      {
        icon: MousePointerClick,
        title: "Contextual feedback",
        desc: "Collect feedback based on what users actually see",
      },
      {
        icon: Layers,
        title: "Real product validation",
        desc: "Test designs before manufacturing or launch",
      },
    ],
    cta: "Try 3D Questions",
  },
  {
    key: "track",
    label: "Track Responses",
    icon: LineChart,
    step: "03",
    title: "Monitor responses\nas they come in",
    description:
      "Watch real-time engagement, completion rates, and response trends with a live dashboard built for clarity.",
    color: "feature-color-emerald",
    bullets: [
      {
        icon: TrendingUp,
        title: "Live response feed",
        desc: "Updates the moment they arrive",
      },
      {
        icon: Gauge,
        title: "Completion rates",
        desc: "See where people drop off",
      },
      {
        icon: Users,
        title: "Audience breakdown",
        desc: "Segment by source and channel",
      },
    ],
    cta: "View Dashboard",
  },
  {
    key: "insights",
    label: "Understand Insights",
    icon: PieChart,
    step: "04",
    title: "Turn feedback into\nclear, smart insights",
    description:
      "Sentiment analysis, trending themes, and AI-generated recommendations help you act on feedback faster.",
    color: "feature-color-amber",
    bullets: [
      {
        icon: PieChart,
        title: "Sentiment analysis",
        desc: "Positive, neutral, negative at a glance",
      },
      {
        icon: Sparkles,
        title: "AI recommendations",
        desc: "Smart next steps from every survey",
      },
      {
        icon: TrendingUp,
        title: "Top themes",
        desc: "Surface what matters most",
      },
    ],
    cta: "See Insights",
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

export const willLoseOptions = (
  currentType: QuestionType,
  newType: QuestionType,
  optionCount: number,
) => {
  return (
    OPTION_TYPES.includes(currentType) &&
    SINGLE_VALUE_TYPES.includes(newType) &&
    optionCount > 0
  );
};

//Format the invited user's initials for avatar display
export const getInitials = (firstname?: string, lastname?: string) => {
  return `${firstname?.[0] ?? ""}${lastname?.[0] ?? ""}`.toUpperCase();
};

// Convert the invite expiry time into readable countdown label
export const getInviteCountdownLabel = (expiresAt: string) => {
  const expiryMs = new Date(expiresAt).getTime();
  const diffMs = expiryMs - Date.now();

  if (diffMs <= 0) return "expired";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) return `${minutes} min`;
  return `${hours}h ${minutes}m`;
};

// password strength indicator for UI
export const getPasswordStrength = (password: string) => {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

// Safe clipboard copy
export const safeCopyText = async (text: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    return true;
  } catch {
    return false;
  }
};

// Safe rich copy to plain text
export const safeCopyHTML = async (html: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      const blob = new Blob([html], { type: "text/html" });
      const data = [new ClipboardItem({ "text/html": blob })];
      await navigator.clipboard.write(data);
    } else {
      await safeCopyText(html); // fallback
    }
    return true;
  } catch {
    return false;
  }
};

// QR to canvas
export const qrToCanvas = async (
  svgNode: SVGElement,
): Promise<HTMLCanvasElement> => {
  const svgData = new XMLSerializer().serializeToString(svgNode);
  const blob = new Blob([svgData], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.src = url;

  await new Promise((res) => (img.onload = res));

  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;

  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0);

  URL.revokeObjectURL(url);

  return canvas;
};

// Generates embed iframe code for survey
export const getEmbedCode = (shareURL: string) => {
  const validatedShareURL = validateShareURL(shareURL);

  const embedURL = new URL(validatedShareURL);
  embedURL.searchParams.set("embed", "true");

  const safeEmbedURL = escapeHtml(embedURL.toString());

  return `<iframe src="${safeEmbedURL}" width="100%" height="600" style="border:none;border-radius:8px;"></iframe>`;
};

// Copies HTML + plain text fallback to clipboard
export const copyRichTextToClipboard = async (html: string) => {
  try {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const plainText = temp.innerText;

    const item = new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([plainText], { type: "text/plain" }),
    });

    await navigator.clipboard.write([item]);
    return true;
  } catch {
    await safeCopyText(html);
    return false;
  }
};

// Prevents duplicate event tracking within a session
export const shouldTrackEvent = (
  key: string,
  ttlMs = 30 * 1000, // 30 sec
): boolean => {
  try {
    const existing = sessionStorage.getItem(key);

    if (existing) {
      const { timestamp } = JSON.parse(existing);

      if (typeof timestamp !== "number") {
        sessionStorage.removeItem(key);
        sessionStorage.setItem(key, JSON.stringify({ timestamp: Date.now() }));
        return true;
      }

      if (Date.now() - timestamp < ttlMs) {
        return false;
      }
    }

    sessionStorage.setItem(key, JSON.stringify({ timestamp: Date.now() }));

    return true;
  } catch {
    return true;
  }
};

// Converts hex color to rgba with custom alpha
export const hexToRgba = (hex: string, alpha: number) => {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const useCases: UseCase[] = [
  {
    eyebrow: "Customer research",
    title: "Customer research",
    description:
      "Understand people’s needs, pain points, and expectations through richer feedback.",
    mockupLabel: "Customer research",
    color: "uc-color-blue",
  },
  {
    eyebrow: "Product feedback",
    title: "Product feedback",
    description:
      "Validate ideas, prioritize your roadmap, and understand what users actually need before building.",
    mockupLabel: "Product feedback",
    color: "uc-color-violet",
  },
  {
    eyebrow: "Marketing research",
    title: "Marketing research",
    description:
      "Test messaging, understand audience intent, and learn what makes people choose, trust, or ignore your offer.",
    mockupLabel: "Marketing research",
    color: "uc-color-emerald",
  },
  {
    eyebrow: "Physical products",
    title: "Physical product testing",
    description:
      "Collect feedback on physical products, packaging, and 3D experiences before launch.",
    mockupLabel: "Physical product",
    color: "uc-color-amber",
  },
];

export const oldWayItems = [
  {
    icon: EyeOff,
    title: "Hidden friction",
    description: "Users hesitate, scroll, and change answers — unseen.",
  },
  {
    icon: CircleDot,
    title: "Surface-level responses",
    description: "You get the responses, not the reason behind it.",
  },
  {
    icon: Img,
    title: "Flat product feedback",
    description: "Images and text fall short for visual or physical products.",
  },
];

export const newWayItems = [
  {
    icon: Crosshair,
    title: "Intent-aware feedback",
    description: "Connect responses with behavior to understand real intent.",
  },
  {
    icon: Activity,
    title: "Behavioral insights",
    description: "Spot uncertainty, confusion, and confidence in interactions.",
  },
  {
    icon: Box,
    title: "3D product feedback",
    description: "Let users explore products naturally before responding.",
  },
];

export const HowItWorksSteps: Step[] = [
  {
    title: "Create",
    description:
      "Build surveys with the question types, design, and flow you need.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    alt: "Person working on a creative project outdoors",
  },
  {
    title: "Share",
    description: "Share by link, QR code, or embed it directly on your site.",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
    alt: "Person focused on laptop in a studio",
  },
  {
    title: "Understand",
    description:
      "See what users say, where they pause, and what their feedback really means.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    alt: "Woman observing feedback and insights",
  },
];

export const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const validateShareURL = (shareURL: string) => {
  const expectedShareOrigin = process.env.CLIENT_SHARE_ORIGIN;

  if (!expectedShareOrigin) {
    throw new Error("CLIENT_SHARE_ORIGIN is not configured");
  }

  const parsedShareURL = new URL(shareURL);
  const parsedExpectedOrigin = new URL(expectedShareOrigin);

  if (parsedShareURL.protocol !== "https:") {
    throw new Error("Invalid share URL protocol");
  }

  if (parsedShareURL.origin !== parsedExpectedOrigin.origin) {
    throw new Error("Invalid share URL origin");
  }

  return parsedShareURL.toString();
};

export const validateImageFile = (file: File) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    showToast.error("Please select a JPEG, PNG, or WebP image.");
    return false;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    showToast.error("File size must be less than 5 MB.");
    return false;
  }

  return true;
};

export const readImagePreview = (
  file: File,
  onPreviewReady: (preview: string) => void,
) => {
  const reader = new FileReader();

  reader.onloadend = () => {
    onPreviewReady(reader.result as string);
  };

  reader.readAsDataURL(file);
};
