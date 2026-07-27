import { Box } from "lucide-react";
import { AiOutlineFieldBinary } from "react-icons/ai";
import { CiViewList } from "react-icons/ci";
import { FaRankingStar, FaRegImage } from "react-icons/fa6";
import { GiChoice } from "react-icons/gi";
import { IoText } from "react-icons/io5";
import {
  LuArrowLeftRight,
  LuGalleryVerticalEnd,
  LuInfo,
  LuTimer,
} from "react-icons/lu";
import {
  MdNumbers,
  MdOutlineLinearScale,
  MdCheckBox,
  MdEmail,
  MdOutlineArrowDropDownCircle,
  MdOutlineFactCheck,
} from "react-icons/md";
import { RxCardStack } from "react-icons/rx";

import type { IconMapping } from "./types";

export const elementIcons: IconMapping = {
  THREE_D: <Box color="#276c9bff" />,
  BINARY: <AiOutlineFieldBinary color="#033A67" />,
  EMAIL_CONTACT: <MdEmail color="#5CD6C8" />,
  END_SCREEN: <LuGalleryVerticalEnd color="#3C3737" />,
  INSTRUCTIONS: <CiViewList color="#0D4C86" />,
  MEDIA: <FaRegImage color="#f2b6c0" />,
  MULTIPLE_CHOICE: <MdCheckBox color="#369acc" />,
  NUMBER: <MdNumbers color="#d69e49" />,
  RADIO: <GiChoice color="#016023" />,
  RANK: <FaRankingStar color="#ffa600" />,
  RANGE: <MdOutlineLinearScale color="#036b82" />,
  TEXT: <IoText color="#c45161" />,
  WELCOME_SCREEN: <RxCardStack color="#3C3737" />,
  DROPDOWN: <MdOutlineArrowDropDownCircle color="#7C3AED" />,
  TIMED_CHOICE: <LuTimer color="#EA580C" />,
  CONCEPT_FIT: <MdOutlineFactCheck color="#0891B2" />,
  IAT: <LuArrowLeftRight color="#DB2777" />,
  INFO_SCREEN: <LuInfo color="#475569" />,
};

/**
 * Question/test types shown in badges, builder menus, and question metadata.
 * INFO_SCREEN is excluded because it is a screen, not an answerable question.
 */
export const questionTypes: {
  id: number;
  label: string;
  type: string;
  icon: JSX.Element;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    id: 1,
    label: "3D",
    type: "THREE_D",
    color: "#276c9bff",
    icon: elementIcons.THREE_D,
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
  },
  {
    id: 2,
    label: "Binary",
    type: "BINARY",
    color: "#7c3aed",
    icon: elementIcons.BINARY,
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
  },
  {
    id: 3,
    label: "Multiple Choice",
    type: "MULTIPLE_CHOICE",
    color: "#2563eb",
    icon: elementIcons.MULTIPLE_CHOICE,
    bgColor: "#eff6ff",
    borderColor: "#dbeafe",
  },
  {
    id: 4,
    label: "Choice",
    type: "RADIO",
    icon: elementIcons.RADIO,
    color: "#22c55e",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  {
    id: 5,
    label: "Text",
    type: "TEXT",
    icon: elementIcons.TEXT,
    color: "#ea580c",
    bgColor: "#fff7ed",
    borderColor: "#ffedd5",
  },
  {
    id: 6,
    label: "Number",
    type: "NUMBER",
    icon: elementIcons.NUMBER,
    color: "#6366f1",
    bgColor: "#eef2ff",
    borderColor: "#c7d2fe",
  },
  {
    id: 7,
    label: "Scale",
    type: "RANGE",
    icon: elementIcons.RANGE,
    color: "#14b8a6",
    bgColor: "#f0fdfa",
    borderColor: "#99f6e4",
  },
  {
    id: 8,
    label: "Rank",
    type: "RANK",
    icon: elementIcons.RANK,
    color: "#e11d48",
    bgColor: "#fff1f2",
    borderColor: "#fecdd3",
  },
  {
    id: 9,
    label: "Media",
    type: "MEDIA",
    icon: elementIcons.MEDIA,
    color: "#06b6d4",
    bgColor: "#ecfeff",
    borderColor: "#a5f3fc",
  },

  // New question/test types.
  {
    id: 10,
    label: "Dropdown",
    type: "DROPDOWN",
    icon: elementIcons.DROPDOWN,
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    borderColor: "#DDD6FE",
  },
  {
    id: 11,
    label: "Timed",
    type: "TIMED_CHOICE",
    icon: elementIcons.TIMED_CHOICE,
    color: "#EA580C",
    bgColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },
  {
    id: 12,
    label: "Concept",
    type: "CONCEPT_FIT",
    icon: elementIcons.CONCEPT_FIT,
    color: "#0891B2",
    bgColor: "#ECFEFF",
    borderColor: "#A5F3FC",
  },
  {
    id: 13,
    label: "IAT",
    type: "IAT",
    icon: elementIcons.IAT,
    color: "#DB2777",
    bgColor: "#FDF2F8",
    borderColor: "#FBCFE8",
  },
] as const;

// for insights question type badge
export const questionTypeMap = Object.fromEntries(
  questionTypes.map((q) => [q.type, q]),
);

export const chipTypeColors: Record<string, string> = {
  WELCOME_SCREEN: "#3C3737",
  INSTRUCTIONS: "#0D4C86",
  EMAIL_CONTACT: "#5CD6C8",
  END_SCREEN: "#3C3737",
  BINARY: "#033A67",
  MULTIPLE_CHOICE: "#369acc",
  RADIO: "#016023",
  TEXT: "#c45161",
  THREE_D: "#276c9bff",
  NUMBER: "#d69e49",
  RANGE: "#036b82",
  RANK: "#ffa600",
  MEDIA: "#f2b6c0",
  DROPDOWN: "#7C3AED",
  TIMED_CHOICE: "#EA580C",
  CONCEPT_FIT: "#0891B2",
  IAT: "#DB2777",
  INFO_SCREEN: "#475569",
};
