import { Box } from "lucide-react";
import { AiOutlineFieldBinary } from "react-icons/ai";
import { CiViewList } from "react-icons/ci";
import { FaRankingStar, FaRegImage } from "react-icons/fa6";
import { GiChoice } from "react-icons/gi";
import { IoText } from "react-icons/io5";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import {
  MdNumbers,
  MdOutlineLinearScale,
  MdCheckBox,
  MdEmail,
} from "react-icons/md";
import { RxCardStack } from "react-icons/rx";

import { BinaryChart } from "../components/Insights/visualizations/BinaryChart";
import { MediaOptionsViz } from "../components/Insights/visualizations/MediaOptionsViz";
import { MultipleChoiceChart } from "../components/Insights/visualizations/MultipleChoiceChart";
import { NumericChart } from "../components/Insights/visualizations/NumericChart";
import { RankingChart } from "../components/Insights/visualizations/RankingChart";
import { ScaleChart } from "../components/Insights/visualizations/ScaleChart";
import { SingleChoiceChart } from "../components/Insights/visualizations/SingleChart";
import { TextResponses } from "../components/Insights/visualizations/TextResponses";
import { ThreeDOptionChart } from "../components/Insights/visualizations/ThreeDOptionChart";
import BinaryElement from "../components/Surveys/Elements/BinaryElement";
import CheckBoxElement from "../components/Surveys/Elements/CheckBoxElement";
import ChoiceElement from "../components/Surveys/Elements/ChoiceElement";
import EmailContactELement from "../components/Surveys/Elements/EmailContactELement";
import EndScreenElement from "../components/Surveys/Elements/EndScreenElement";
import InstructionsElement from "../components/Surveys/Elements/InstructionsElement";
import MediaElement from "../components/Surveys/Elements/MediaElement";
import NumberElement from "../components/Surveys/Elements/NumberElement";
import RankElement from "../components/Surveys/Elements/RankElement";
import ScaleElement from "../components/Surveys/Elements/ScaleElement";
import TextElement from "../components/Surveys/Elements/TextElement";
import ThreeDElement from "../components/Surveys/Elements/ThreeDElement";
import WelcomeScreenElement from "../components/Surveys/Elements/WelcomeScreenElement";
import BinaryElementSettings from "../components/Surveys/ElementSettings/BinaryElementSettings";
import CheckBoxElementSettings from "../components/Surveys/ElementSettings/CheckBoxElementSettings";
import ChoiceElementSettings from "../components/Surveys/ElementSettings/ChoiceElementSettings";
import EmailContactElementSettings from "../components/Surveys/ElementSettings/EmailContactElementSettings";
import EndScreenElementSettings from "../components/Surveys/ElementSettings/EndScreenElementSettings";
import InstructionsElementSettings from "../components/Surveys/ElementSettings/InstructionsElementSettings";
import MediaElementSettings from "../components/Surveys/ElementSettings/MediaElementSettings";
import NumberElementSettings from "../components/Surveys/ElementSettings/NumberElementSettings";
import RankElementSettings from "../components/Surveys/ElementSettings/RankElementSettings";
import ScaleElementSettings from "../components/Surveys/ElementSettings/ScaleElementSettings";
import TextElementSettings from "../components/Surveys/ElementSettings/TextElementSettings";
import ThreeDElementSettings from "../components/Surveys/ElementSettings/ThreeDElementSettings";
import WelcomeScreenElementSettings from "../components/Surveys/ElementSettings/WelcomeScreenElementSettings";
import {
  ElementType,
  IconMapping,
  ElementProps,
  QuestionTypeKey,
} from "../utils/types";

import { SummaryQuestion } from "./insightTypes";

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
};

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
};

export const elementComponents: {
  [key in QuestionTypeKey]: React.ComponentType<ElementProps>;
} = {
  BINARY: BinaryElement,
  EMAIL_CONTACT: EmailContactELement,
  END_SCREEN: EndScreenElement,
  INSTRUCTIONS: InstructionsElement,
  MEDIA: MediaElement,
  MULTIPLE_CHOICE: CheckBoxElement,
  NUMBER: NumberElement,
  RADIO: ChoiceElement,
  RANK: RankElement,
  RANGE: ScaleElement,
  TEXT: TextElement,
  THREE_D: ThreeDElement,
  WELCOME_SCREEN: WelcomeScreenElement,
};

export const elementSettingsComponents: {
  [key in QuestionTypeKey]: React.ComponentType<ElementProps>;
} = {
  BINARY: BinaryElementSettings,
  EMAIL_CONTACT: EmailContactElementSettings,
  END_SCREEN: EndScreenElementSettings,
  INSTRUCTIONS: InstructionsElementSettings,
  MEDIA: MediaElementSettings,
  MULTIPLE_CHOICE: CheckBoxElementSettings,
  NUMBER: NumberElementSettings,
  RADIO: ChoiceElementSettings,
  RANK: RankElementSettings,
  RANGE: ScaleElementSettings,
  TEXT: TextElementSettings,
  THREE_D: ThreeDElementSettings,
  WELCOME_SCREEN: WelcomeScreenElementSettings,
};

export const elementTypes: { [key: string]: ElementType } = {
  ThreeD: {
    type: "Three_D",
    icon: elementIcons.THREE_D,
    text: "Your question here",
    Element: ThreeDElement,
    Settings: ThreeDElementSettings,
  },
  Binary: {
    type: "Binary",
    icon: elementIcons.BINARY,
    text: "Your question here",
    Element: BinaryElement,
    Settings: BinaryElementSettings,
  },
  Checkbox: {
    type: "Checkbox",
    icon: elementIcons.MULTIPLE_CHOICE,
    text: "Your question here",
    Element: CheckBoxElement,
    Settings: CheckBoxElementSettings,
  },
  Choice: {
    type: "Choice",
    icon: elementIcons.RADIO,
    text: "Your question here",
    Element: ChoiceElement,
    Settings: ChoiceElementSettings,
  },
  EmailContact: {
    type: "EmailContact",
    icon: elementIcons.EMAIL_CONTACT,
    text: "Your question here",
    Element: EmailContactELement,
    Settings: EmailContactElementSettings,
  },
  EndScreen: {
    type: "EndScreen",
    icon: elementIcons.END_SCREEN,
    text: "Your question here",
    Element: EndScreenElement,
    Settings: EndScreenElementSettings,
  },
  Instructions: {
    type: "Instructions",
    icon: elementIcons.INSTRUCTIONS,
    text: "Your question here",
    Element: InstructionsElement,
    Settings: InstructionsElementSettings,
  },
  Media: {
    type: "Media",
    icon: elementIcons.MEDIA,
    text: "Your question here",
    Element: MediaElement,
    Settings: MediaElementSettings,
  },
  Number: {
    type: "Number",
    icon: elementIcons.NUMBER,
    text: "Your question here",
    Element: NumberElement,
    Settings: NumberElementSettings,
  },
  Rank: {
    type: "Rank",
    icon: elementIcons.RANK,
    text: "Your question here",
    Element: RankElement,
    Settings: RankElementSettings,
  },
  Scale: {
    type: "Scale",
    icon: elementIcons.RANGE,
    text: "Your question here",
    Element: ScaleElement,
    Settings: ScaleElementSettings,
  },
  Text: {
    type: "Text",
    icon: elementIcons.TEXT,
    text: "Your question here",
    Element: TextElement,
    Settings: TextElementSettings,
  },
  WelcomeScreen: {
    type: "WelcomeScreen",
    icon: elementIcons.WELCOME_SCREEN,
    text: "Your question here",
    Element: WelcomeScreenElement,
    Settings: WelcomeScreenElementSettings,
  },
};

// Summary Insights Visualization registry

export const summaryVisualizationMap: Record<
  SummaryQuestion["type"],
  React.FC<{ question: any }>
> = {
  BINARY: BinaryChart,
  THREE_D: ThreeDOptionChart,
  RADIO: SingleChoiceChart,
  MULTIPLE_CHOICE: MultipleChoiceChart,
  MEDIA: MediaOptionsViz,
  RANGE: ScaleChart,
  NUMBER: NumericChart,
  RANK: RankingChart,
  TEXT: TextResponses,
};
