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

export type IATGroup = "THEME_A" | "THEME_B";

export type IATOptionSettings = {
  iatGroup?: IATGroup;
  iatStimulusType?: "ATTRIBUTE";
};

export type IATCategoryItem = {
  id: string;
  label: string;
};

export type IATUiConfig = {
  iatBrandA?: IATCategoryItem;
  iatBrandB?: IATCategoryItem;
  iatThemeA?: IATCategoryItem;
  iatThemeB?: IATCategoryItem;
  iatLeftKey?: string;
  iatRightKey?: string;
};

export type IATCategorySettingsForm = {
  iatBrandALabel: string;
  iatBrandBLabel: string;
  iatThemeALabel: string;
  iatThemeBLabel: string;
  iatLeftKey: string;
  iatRightKey: string;
};

export const DEFAULT_IAT_UI_CONFIG: Required<IATUiConfig> = {
  iatBrandA: {
    id: "brand_a",
    label: "Brand A",
  },
  iatBrandB: {
    id: "brand_b",
    label: "Brand B",
  },
  iatThemeA: {
    id: "theme_a",
    label: "Association A",
  },
  iatThemeB: {
    id: "theme_b",
    label: "Association B",
  },
  iatLeftKey: "E",
  iatRightKey: "I",
};

export type IATAttributeGroupPanelProps = {
  qID?: string;
  group: IATGroup;
  title: string;
  options: OptionType[];
  allOptions: OptionType[];
};

export type IATCombinedBlockPreviewProps = {
  centerStimulus: string;
};

export type IATCombinedSideCardProps = {
  keyLabel: string;
  brandLabel: string;
  themeLabel: string;
  canEdit: boolean;
  onBrandUpdate: (value: string) => void;
  onThemeUpdate: (value: string) => void;
};

export type IATInlineEditableTextProps = {
  value: string;
  canEdit: boolean;
  fontSize: number;
  fontWeight: number;
  color: string;
  onSave: (value: string) => void;
};

export type IATSettingsTextFieldProps = {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
};
