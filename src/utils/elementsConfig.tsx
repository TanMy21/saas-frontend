import { AiOutlineFieldBinary } from "react-icons/ai";
import { GiChoice } from "react-icons/gi";
import { IoText } from "react-icons/io5";
import { MdNumbers } from "react-icons/md";
import { FaRankingStar } from "react-icons/fa6";
import { MdOutlineLinearScale } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";
import { MdCheckBox } from "react-icons/md";
import BinaryElement from "../components/Surveys/Elements/BinaryElement";
import ChoiceElement from "../components/Surveys/Elements/ChoiceElement";
import TextElement from "../components/Surveys/Elements/TextElement";
import NumberElement from "../components/Surveys/Elements/NumberElement";
import RankElement from "../components/Surveys/Elements/RankElement";
import ScaleElement from "../components/Surveys/Elements/ScaleElement";
import MediaElement from "../components/Surveys/Elements/MediaElement";
import CheckBoxElement from "../components/Surveys/Elements/CheckBoxElement";
import { ElementType } from "./types";

export const elementIcons = {
  Binary: <AiOutlineFieldBinary color="#f7c435" />,
  Choice: <GiChoice color="#f7c435" />,
  Text: <IoText color="#c45161" />,
  Number: <MdNumbers color="#d69e49" />,
  Rank: <FaRankingStar color="#ffa600" />,
  Scale: <MdOutlineLinearScale color="#036b82" />,
  Media: <FaRegImage color="#f2b6c0" />,
  Checkbox: <MdCheckBox color="#369acc" />,
};

export const elementTypes: { [key: string]: ElementType } = {
  Binary: {
    type: "Binary",
    icon: elementIcons.Binary,
    question: "Your question here",
    Element: BinaryElement,
  },
  Choice: {
    type: "Choice",
    icon: elementIcons.Choice,
    question: "Your question here",
    Element: ChoiceElement,
  },
  Text: {
    type: "Text",
    icon: elementIcons.Text,
    question: "Your question here",
    Element: TextElement,
  },
  Number: {
    type: "Number",
    icon: elementIcons.Number,
    question: "Your question here",
    Element: NumberElement,
  },
  Rank: {
    type: "Rank",
    icon: elementIcons.Rank,
    question: "Your question here",
    Element: RankElement,
  },
  Scale: {
    type: "Scale",
    icon: elementIcons.Scale,
    question: "Your question here",
    Element: ScaleElement,
  },
  Media: {
    type: "Media",
    icon: elementIcons.Media,
    question: "Your question here",
    Element: MediaElement,
  },
  Checkbox: {
    type: "Checkbox",
    icon: elementIcons.Checkbox,
    question: "Your question here",
    Element: CheckBoxElement,
  },
};
