import { BarChart3, Shield, Smartphone, Users } from "lucide-react";
import { type Transition } from "motion/react";

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

export const NO_CONDITION_TYPES = new Set<string>(["RANK", "THREE_D"]);
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
