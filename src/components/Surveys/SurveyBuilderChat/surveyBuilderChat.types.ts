export type SurveyChatRole = "assistant" | "user";

export type SurveyChatMessageKind =
  | "welcome"
  | "text"
  | "attachment"
  | "progress"
  | "question-count"
  | "question-types"
  | "preview"
  | "success"
  | "error";

export type SurveyChatPhase =
  | "idle"
  | "processing-document"
  | "choosing-count"
  | "choosing-types"
  | "generating"
  | "reviewing"
  | "approved"
  | "importing"
  | "imported";

export type SurveyChatAttachment = {
  name: string;
  size: number;
  mimeType: string;
  extension: string;
};

export type SurveyChatProgress = {
  value: number;
  label: string;
  detail: string;
};

export type SurveyChatPreviewQuestion = {
  id: string;
  number: number;
  type: string;
  typeLabel: string;
  prompt: string;
  options?: string[];
};

export type SurveyChatMessage = {
  id: string;
  role: SurveyChatRole;
  kind: SurveyChatMessageKind;
  text?: string;
  createdAt: Date;
  attachment?: SurveyChatAttachment;
  progress?: SurveyChatProgress;
  preview?: SurveyChatPreviewQuestion[];
  previewTotal?: number;
};

export type SurveyChatUploadMode = "generate" | "import";

export type SurveyBuilderChatContextValue = {
  messages: SurveyChatMessage[];
  phase: SurveyChatPhase;
  isRunning: boolean;
  selectedQuestionCount: number;
  selectedQuestionTypes: string[];
  uploadDocument: (file: File, mode: SurveyChatUploadMode) => void;
  chooseQuestionCount: (count: number) => void;
  toggleQuestionType: (type: string) => void;
  generateQuestions: () => void;
  approveQuestions: () => void;
  requestRevision: () => void;
  resetConversation: () => void;
};
