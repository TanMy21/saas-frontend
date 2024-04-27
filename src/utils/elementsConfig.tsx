import { AiOutlineFieldBinary } from "react-icons/ai";
import { GiChoice } from "react-icons/gi";
import { IoText } from "react-icons/io5";
import { MdNumbers } from "react-icons/md";
import { FaRankingStar } from "react-icons/fa6";
import { MdOutlineLinearScale } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";
import { MdCheckBox } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import { RxCardStack } from "react-icons/rx";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import BinaryElement from "../components/Surveys/Elements/BinaryElement";
import ChoiceElement from "../components/Surveys/Elements/ChoiceElement";
import CheckBoxElement from "../components/Surveys/Elements/CheckBoxElement";
import EmailContactELement from "../components/Surveys/Elements/EmailContactELement";
import EndScreenElement from "../components/Surveys/Elements/EndScreenElement";
import InstructionsElement from "../components/Surveys/Elements/InstructionsElement";
import MediaElement from "../components/Surveys/Elements/MediaElement";
import NumberElement from "../components/Surveys/Elements/NumberElement";
import RankElement from "../components/Surveys/Elements/RankElement";
import ScaleElement from "../components/Surveys/Elements/ScaleElement";
import TextElement from "../components/Surveys/Elements/TextElement";
import WelcomeScreenElement from "../components/Surveys/Elements/WelcomeScreenElement";
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

export const elementTypes: { [key: string]: ElementType } = {
  Binary: {
    type: "Binary",
    icon: elementIcons.BINARY,
    text: "Your question here",
    Element: BinaryElement,
  },
  Checkbox: {
    type: "Checkbox",
    icon: elementIcons.MULTIPLE_CHOICE,
    text: "Your question here",
    Element: CheckBoxElement,
  },
  Choice: {
    type: "Choice",
    icon: elementIcons.RADIO,
    text: "Your question here",
    Element: ChoiceElement,
  },
  EmailContact: {
    type: "EmailContact",
    icon: elementIcons.EMAIL_CONTACT,
    text: "Your question here",
    Element: EmailContactELement,
  },
  EndScreen: {
    type: "EndScreen",
    icon: elementIcons.END_SCREEN,
    text: "Your question here",
    Element: EndScreenElement,
  },
  Instructions: {
    type: "Instructions",
    icon: elementIcons.INSTRUCTIONS,
    text: "Your question here",
    Element: InstructionsElement,
  },
  Media: {
    type: "Media",
    icon: elementIcons.MEDIA,
    text: "Your question here",
    Element: MediaElement,
  },
  Number: {
    type: "Number",
    icon: elementIcons.NUMBER,
    text: "Your question here",
    Element: NumberElement,
  },
  Rank: {
    type: "Rank",
    icon: elementIcons.RANK,
    text: "Your question here",
    Element: RankElement,
  },
  Scale: {
    type: "Scale",
    icon: elementIcons.RANGE,
    text: "Your question here",
    Element: ScaleElement,
  },
  Text: {
    type: "Text",
    icon: elementIcons.TEXT,
    text: "Your question here",
    Element: TextElement,
  },
  WelcomeScreen: {
    type: "WelcomeScreen",
    icon: elementIcons.WELCOME_SCREEN,
    text: "Your question here",
    Element: WelcomeScreenElement,
  },
};
