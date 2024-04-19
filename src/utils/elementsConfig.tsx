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
import {
  ElementType,
  IconMapping,
  ElementProps,
  QuestionTypeKey,
} from "../utils/types";

export const elementIcons: IconMapping = {
  BINARY: <AiOutlineFieldBinary color="#f7c435" />,
  RADIO: <GiChoice color="#f7c435" />,
  TEXT: <IoText color="#c45161" />,
  NUMBER: <MdNumbers color="#d69e49" />,
  RANK: <FaRankingStar color="#ffa600" />,
  RANGE: <MdOutlineLinearScale color="#036b82" />,
  MEDIA: <FaRegImage color="#f2b6c0" />,
  MULTIPLE_CHOICE: <MdCheckBox color="#369acc" />,
};

export const elementComponents: {
  [key in QuestionTypeKey]: React.ComponentType<ElementProps>;
} = {
  BINARY: BinaryElement,
  RADIO: ChoiceElement,
  TEXT: TextElement,
  NUMBER: NumberElement,
  RANK: RankElement,
  RANGE: ScaleElement,
  MEDIA: MediaElement,
  MULTIPLE_CHOICE: CheckBoxElement,
};

export const elementTypes: { [key: string]: ElementType } = {
  Binary: {
    type: "Binary",
    icon: elementIcons.BINARY,
    text: "Your question here",
    Element: BinaryElement,
  },
  Choice: {
    type: "Choice",
    icon: elementIcons.RADIO,
    text: "Your question here",
    Element: ChoiceElement,
  },
  Text: {
    type: "Text",
    icon: elementIcons.TEXT,
    text: "Your question here",
    Element: TextElement,
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
  Media: {
    type: "Media",
    icon: elementIcons.MEDIA,
    text: "Your question here",
    Element: MediaElement,
  },
  Checkbox: {
    type: "Checkbox",
    icon: elementIcons.MULTIPLE_CHOICE,
    text: "Your question here",
    Element: CheckBoxElement,
  },
};
