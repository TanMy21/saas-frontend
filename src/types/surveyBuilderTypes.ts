import { ReactNode } from "react";

import { type DropResult } from "react-beautiful-dnd";

import {
  ElementImageAsset,
  ElementProps,
  OptionType,
  QuestionTypeKey,
} from "../utils/types";

import { GeneratedDropdownOption } from "./genTypes";

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

export type SettingSaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export type ConceptFitDisplayMode = "TEXT" | "IMAGE";

export type TimedChoiceDisplayMode = "TEXT" | "IMAGE";

export type ConceptFitSettingsForm = {
  conceptDisplayMode: ConceptFitDisplayMode;
  randomizeAttributes: boolean;
  autoAdvanceOnAnswer: boolean;
  timeLimitSeconds: number;
};

export type TimedChoiceSettingsForm = {
  timeLimitSeconds: number;
  showCountdown: boolean;
  autoAdvanceOnAnswer: boolean;
  allowTimeout: boolean;
  timedChoiceDisplayMode: TimedChoiceDisplayMode;
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
  questionImages?: ElementImageAsset[];
  qImage?: boolean;
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

export type IATCategorySettingsForm = {
  iatLeftCategoryLabel: string;
  iatRightCategoryLabel: string;
  iatLeftKey: string;
  iatRightKey: string;
};

export type IATBehaviorSettingsForm = {
  iatShowKeyboardHints: boolean;
  iatRandomizeStimuli: boolean;
  autoAdvanceOnAnswer: boolean;
};

export type ImplicitAssociationTestBlockPreviewProps = {
  centerStimulus: string;
};

export type IATStimulusManagerProps = {
  qID?: string;
  display?: ElementProps["display"];
};

export type IATStimulusRowProps = {
  option: OptionType;
  index: number;
  canEdit: boolean;
  canDelete: boolean;
  canReorder: boolean;
  dragHandleProps?: any;
  onUpdate: (option: OptionType, nextText: string) => Promise<void>;
  onDelete: (optionID: string) => Promise<void>;
};

export type DropdownManualAddProps = {
  inputValue: string;
  disabled: boolean;
  onInputChange: (value: string) => void;
  onAddOptions: () => void;
  onOpenAI: () => void;
};

export type DropdownAIPromptDialogProps = {
  open: boolean;
  prompt: string;
  count: number;
  maxCount: number;
  isGenerating: boolean;
  onClose: () => void;
  onPromptChange: (value: string) => void;
  onCountChange: (value: number) => void;
  onGenerate: () => void;
};

export type DropdownAIReviewDialogProps = {
  open: boolean;
  options: GeneratedDropdownOption[];
  onClose: () => void;
  onBack: () => void;
  isAddingReviewedOptions: boolean;
  onUpdateOption: (index: number, value: string) => void;
  onDeleteOption: (index: number) => void;
  onAddReviewedOptions: () => void;
};

export const TIMED_CHOICE_DISPLAY_MODE_OPTIONS: {
  label: string;
  value: TimedChoiceDisplayMode;
}[] = [
  { label: "Text", value: "TEXT" },
  { label: "Image", value: "IMAGE" },
];

export interface TimerPreviewProps {
  seconds: number;
  accent?: string;
  label?: string;
}

export interface MobileShellProps {
  children: ReactNode;
  accent?: string;
}

export interface TimedChoiceMobilePreviewProps {
  options: OptionType[];
  questionImages: QuestionImageAsset[];
  durationSeconds: number;
  displayMode: TimedChoiceDisplayMode;
}

export interface TimedChoiceMobileOptionCardProps {
  option: OptionType;
  imageUrl?: string | null;
  displayMode: TimedChoiceDisplayMode;
}

export type EditableQuestionTextProps = {
  active: boolean;
  value?: string | null;
  placeholder?: string;
  onStartEdit: () => void;
  onChange: (html: string) => void;
  onFormatted: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  editorSx?: any;
};
