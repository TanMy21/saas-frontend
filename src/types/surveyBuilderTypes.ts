import { type DropResult } from "react-beautiful-dnd";

import { ElementImageAsset, OptionType, QuestionTypeKey } from "../utils/types";

export interface ShareTabProps {
  title: string;
  shareURL: string;
  shareID?: string;
  surveyID?: string;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  trackShareEvent: (args: { surveyID: string; actionType: string }) => void;
}

export type TabType = "link" | "email" | "embed";

export type AddMenuItemConfig = {
  label: string;
  type: QuestionTypeKey;
  icon: JSX.Element;
  color: string;
  action: "QUESTION" | "SCREEN";
  disabled?: boolean;
  title?: string;
  professionalOnly?: boolean;
};

export type OrderedSurveyElement = {
  questionID: string;
  type: string;
  order?: number | null;
};

export type InfoScreenRichTextSettingsProps = {
  qID?: string;
};

export type TimedChoiceSettingsForm = {
  timeLimitSeconds: number;
  showCountdown: boolean;
  autoAdvanceOnAnswer: boolean;
  allowTimeout: boolean;
};

export type SettingSaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export type ConceptFitDisplayMode = "TEXT" | "IMAGE";

export type ConceptFitSettingsForm = {
  conceptDisplayMode: ConceptFitDisplayMode;
  randomizeAttributes: boolean;
  autoAdvanceOnAnswer: boolean;
};

export type ConceptFitStimulusLayoutProps = {
  qID?: string;
  display?: "desktop" | "mobile";
  localOptions: OptionType[];
  inputValue: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;

  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canReorder: boolean;
  canAddMore: boolean;
  hasMinimumRecommended: boolean;
  qImage?: ElementImageAsset[];

  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleAddAttributes: () => Promise<void>;
  handleDeleteAttribute: (optionID: string) => Promise<void>;
  handleDragEnd: (result: DropResult) => Promise<void>;
};

export type QuestionImageAsset = {
  questionImageID: string;
  questionID: string;
  imageUrl: string;
  publicId: string;
  role: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};
