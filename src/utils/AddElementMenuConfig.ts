import { AddMenuItemConfig } from "../types/surveyBuilderTypes";

import { elementIcons } from "./elementsConfig";

 
export const questionMenuItems: AddMenuItemConfig[] = [
  {
    label: "Binary",
    type: "BINARY",
    icon: elementIcons.BINARY,
    color: "#31029c",
    action: "QUESTION",
  },
  {
    label: "Choice",
    type: "RADIO",
    icon: elementIcons.RADIO,
    color: "#f7c435",
    action: "QUESTION",
  },
  {
    label: "Dropdown",
    type: "DROPDOWN",
    icon: elementIcons.DROPDOWN,
    color: "#7C3AED",
    action: "QUESTION",
  },
  {
    label: "Text",
    type: "TEXT",
    icon: elementIcons.TEXT,
    color: "#c45161",
    action: "QUESTION",
  },
  {
    label: "Number",
    type: "NUMBER",
    icon: elementIcons.NUMBER,
    color: "#d69e49",
    action: "QUESTION",
  },
  {
    label: "Rank",
    type: "RANK",
    icon: elementIcons.RANK,
    color: "#ffa600",
    action: "QUESTION",
  },
  {
    label: "Scale",
    type: "RANGE",
    icon: elementIcons.RANGE,
    color: "#036b82",
    action: "QUESTION",
  },
  {
    label: "Media",
    type: "MEDIA",
    icon: elementIcons.MEDIA,
    color: "#f2b6c0",
    action: "QUESTION",
  },
  {
    label: "Checkbox",
    type: "MULTIPLE_CHOICE",
    icon: elementIcons.MULTIPLE_CHOICE,
    color: "#369acc",
    action: "QUESTION",
  },
];

 
export const implicitMenuItems: AddMenuItemConfig[] = [
  {
    label: "Timed",
    type: "TIMED_CHOICE",
    icon: elementIcons.TIMED_CHOICE,
    color: "#EA580C",
    action: "QUESTION",
  },
  {
    label: "Concept",
    type: "CONCEPT_FIT",
    icon: elementIcons.CONCEPT_FIT,
    color: "#0891B2",
    action: "QUESTION",
  },
  {
    label: "IAT",
    type: "IAT",
    icon: elementIcons.IAT,
    color: "#DB2777",
    action: "QUESTION",
  },
];

 
export const baseScreenMenuItems: AddMenuItemConfig[] = [
  {
    label: "Email",
    type: "EMAIL_CONTACT",
    icon: elementIcons.EMAIL_CONTACT,
    color: "#31029c",
    action: "SCREEN",
  },
  {
    label: "Instructions",
    type: "INSTRUCTIONS",
    icon: elementIcons.INSTRUCTIONS,
    color: "#f7c435",
    action: "SCREEN",
  },
  {
    label: "Info Screen",
    type: "INFO_SCREEN",
    icon: elementIcons.INFO_SCREEN,
    color: "#475569",
    action: "QUESTION",
  },
  {
    label: "Welcome",
    type: "WELCOME_SCREEN",
    icon: elementIcons.WELCOME_SCREEN,
    color: "#c45161",
    action: "SCREEN",
  },
  {
    label: "End",
    type: "END_SCREEN",
    icon: elementIcons.END_SCREEN,
    color: "#d69e49",
    action: "SCREEN",
  },
];

 
export const threeDMenuItem: AddMenuItemConfig = {
  label: "3D",
  type: "THREE_D",
  icon: elementIcons.THREE_D,
  color: "#086083ff",
  action: "QUESTION",
};