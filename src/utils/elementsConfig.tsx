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
import WelcomeScreenElementSettings from "../components/Surveys/ElementSettings/WelcomeScreenElementSettings";
import {
  ElementType,
  IconMapping,
  ElementProps,
  QuestionTypeKey,
} from "../utils/types";

export const elementIcons: IconMapping = {
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
}[] = [
  {
    id: 1,
    label: "Binary",
    type: "BINARY",
    icon: elementIcons.BINARY,
  },
  {
    id: 2,
    label: "Multiple Choice",
    type: "MULTIPLE_CHOICE",
    icon: elementIcons.MULTIPLE_CHOICE,
  },
  { id: 3, label: "Choice", type: "RADIO", icon: elementIcons.RADIO },
  { id: 4, label: "Text", type: "TEXT", icon: elementIcons.TEXT },
  { id: 5, label: "Number", type: "NUMBER", icon: elementIcons.NUMBER },
  { id: 6, label: "Scale", type: "RANGE", icon: elementIcons.RANGE },
  { id: 7, label: "Rank", type: "RANK", icon: elementIcons.RANK },
  { id: 8, label: "Media", type: "MEDIA", icon: elementIcons.MEDIA },
];

export const chipTypeColors: Record<string, string> = {
  WELCOME_SCREEN: "#3C3737",
  INSTRUCTIONS: "#0D4C86",
  EMAIL_CONTACT: "#5CD6C8",
  END_SCREEN: "#3C3737",
  BINARY: "#033A67",
  MULTIPLE_CHOICE: "#369acc",
  RADIO: "#016023",
  TEXT: "#c45161",
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
  WELCOME_SCREEN: WelcomeScreenElementSettings,
};

export const elementTypes: { [key: string]: ElementType } = {
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
