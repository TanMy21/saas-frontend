import { ReactNode } from "react";

import { STORAGE_VERSION } from "../utils/constants";

export type SurveyChatRole = "assistant" | "user";

export type AssistantCommitMode = "APPEND" | "REPLACE_ALL" | "REORDER";

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

export type ISODateString = string;

export type AssistantThreadStage =
  | "COLLECTING_INPUT"
  | "PROCESSING"
  | "REVIEW"
  | "COMMITTING"
  | "COMMITTED"
  | "FAILED";

export type AssistantThreadStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export type AssistantMessageRole = "USER" | "ASSISTANT" | "SYSTEM" | "TOOL";

export type AssistantMessageStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type AssistantJobStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type AssistantDocumentStatus =
  | "UPLOADING"
  | "PENDING_SCAN"
  | "SCANNING"
  | "REJECTED"
  | "SCAN_FAILED"
  | "ANALYZING"
  | "READY"
  | "ANALYSIS_FAILED"
  | "DELETED";

export type AssistantComposerDocumentStatus =
  | AssistantDocumentStatus
  | "UPLOAD_FAILED"
  | "POLLING_FAILED";

export type AssistantQuestionType =
  | "BINARY"
  | "CONCEPT_FIT"
  | "DROPDOWN"
  | "IAT"
  | "MEDIA"
  | "MULTIPLE_CHOICE"
  | "NUMBER"
  | "RADIO"
  | "RANGE"
  | "RANK"
  | "TEXT"
  | "TIMED_CHOICE";

export type AssistantIATGroup = "THEME_A" | "THEME_B";

export type AssistantIATStimulusType = "ATTRIBUTE";

export interface AssistantDraftOptionSettings {
  iatGroup?: AssistantIATGroup;
  iatStimulusType?: AssistantIATStimulusType;
}

export interface AssistantDraftOption {
  draftOptionID: string;
  text: string;
  settings: AssistantDraftOptionSettings;
}

export interface AssistantIATConfig {
  brandA: string;
  brandB: string;
  themeA: string;
  themeB: string;
}

export interface AssistantGenerationRequirements {
  topic: string | null;
  description: string | null;
  questionCount: number | null;
  questionTypes: AssistantDraftQuestion["type"][];
  chooseQuestionTypesForMe: boolean;
}

export interface AssistantDraftQuestion {
  draftQuestionID: string;
  text: string;
  description: string | null;
  type: AssistantQuestionType;
  required: boolean;
  options: AssistantDraftOption[];
  iatConfig: AssistantIATConfig | null;
}

export interface AssistantDraft {
  schemaVersion: number;
  commitMode: AssistantCommitMode;
  replacementProposal?: AssistantReplacementProposal | null;
  version: number;
  title: string;
  description: string | null;
  questions: AssistantDraftQuestion[];
}

export interface AssistantWorkflowState {
  lastIntent?: string | null;
  lastActionName?: string | null;
  missingFields?: string[];
  draftVersion?: number;
  activeMode?: "IMPORT" | "GENERATE" | null;
  generationRequirements?: AssistantGenerationRequirements | null;
}

export interface AssistantThread {
  threadID: string;
  surveyID: string;
  status: AssistantThreadStatus;
  stage: AssistantThreadStage;
  createdByUserID: string;
  workflowState?: AssistantWorkflowState | null;
  lastMessageAt?: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  draft: AssistantDraft;
}

export interface AssistantTextPart {
  type: "text";
  text: string;
}

export interface AssistantDocumentAttachmentPart {
  type: "document-attachment";
  documentID: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface AssistantSurveyPreviewPart {
  type: "survey-preview";
  draftVersion: number;
  commitMode: AssistantCommitMode;
  replacedQuestionCount?: number | null;
  removesFlowLogic?: boolean;
  title: string;
  questions: AssistantDraftQuestion[];
}

export interface AssistantSurveyOrderPreviewQuestion {
  text: string;
  previousPosition: number;
  proposedPosition: number;
  moved: boolean;
}

export interface AssistantSurveyOrderPreviewPart {
  type: "survey-order-preview";
  draftVersion: number;
  requestedGrouping: string;
  questions: AssistantSurveyOrderPreviewQuestion[];
}

export interface AssistantApprovalControlsPart {
  type: "approval-controls";
  draftVersion: number;
  commitMode?: AssistantCommitMode;
  questionCount?: number;
  replacedQuestionCount?: number | null;
}

export type AssistantMessagePart =
  | AssistantTextPart
  | AssistantDocumentAttachmentPart
  | AssistantSurveyPreviewPart
  | AssistantSurveyOrderPreviewPart
  | AssistantApprovalControlsPart;

export interface AssistantMessageContent {
  parts: AssistantMessagePart[];
}

export interface AssistantMessage {
  messageID: string;
  role: AssistantMessageRole;
  status: AssistantMessageStatus;
  sequence: number;
  authorUserID: string | null;
  content: AssistantMessageContent;
  errorCode: string | null;
  createdAt: ISODateString;
}

export interface AssistantMessagesResponse {
  messages: AssistantMessage[];
  hasMore: boolean;
  nextBeforeSequence: number | null;
}

export interface AssistantJob {
  jobID: string;
  threadID: string;
  runID: string | null;
  status: AssistantJobStatus;
  intent: string | null;
  actionName: string | null;
  inputDraftVersion: number | null;
  outputDraftVersion: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: ISODateString;
  startedAt: ISODateString | null;
  completedAt: ISODateString | null;
}

export interface AssistantDocument {
  documentID: string;
  clientDocumentID: string;
  threadID: string;
  status: AssistantDocumentStatus;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  analysis: unknown;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  analyzedAt: ISODateString | null;
  deletedAt: ISODateString | null;
}

export interface AssistantDocumentResponse {
  jobID: string;
  document: AssistantDocument;
}

export interface UploadAssistantDocumentResponse extends AssistantDocumentResponse {
  replayed: boolean;
}

export interface DeleteAssistantDocumentResponse {
  replayed: boolean;
  document: AssistantDocument;
}

export interface AssistantComposerDocument {
  clientDocumentID: string;
  documentID: string | null;
  file: File;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  status: AssistantComposerDocumentStatus;
  errorMessage: string | null;
}

export interface CreateAssistantThreadArgs {
  surveyID: string;
}

export interface GetAssistantThreadArgs {
  surveyID: string;
  threadID: string;
}

export interface GetAssistantMessagesArgs extends GetAssistantThreadArgs {
  limit?: number;
  beforeSequence?: number;
}

export interface UploadAssistantDocumentArgs extends GetAssistantThreadArgs {
  clientDocumentID: string;
  document: File;
}

export interface GetAssistantDocumentArgs extends GetAssistantThreadArgs {
  documentID: string;
}

export interface SendAssistantMessageArgs extends GetAssistantThreadArgs {
  clientMessageID: string;
  message: string;
  documentIDs?: string[];
}

export interface SendAssistantMessageResponse {
  replayed: boolean;
  jobID: string;
  threadID: string;
  runID: string | null;
  status: AssistantJobStatus;
}

export interface GetAssistantJobArgs extends GetAssistantThreadArgs {
  jobID: string;
}

export interface CommitAssistantDraftArgs extends GetAssistantThreadArgs {
  expectedVersion: number;
  idempotencyKey: string;
}

export interface AssistantCommitResult {
  threadID: string;
  draftID: string;
  surveyID: string;
  draftVersion: number;
  createdQuestionIDs: string[];
  createdQuestionCount: number;
  committedAt: ISODateString;
}

export interface CommitAssistantDraftResponse {
  replayed: boolean;
  result: AssistantCommitResult;
}

export interface AssistantApiError {
  code: string;
  message: string;
}

export interface StoredAssistantSession {
  threadID: string;
  activeJobID?: string;
}

export interface StoredAssistantSessionEnvelope {
  storageVersion: typeof STORAGE_VERSION;
  session: StoredAssistantSession;
}

export interface SurveyBuilderAssistantContextValue {
  thread: AssistantThread | null;
  messages: AssistantMessage[];
  isInitializing: boolean;
  isSending: boolean;
  isGenerating: boolean;
  isCommitting: boolean;
  isLoadingOlder: boolean;
  hasMoreMessages: boolean;
  canSendMessages: boolean;
  canSendComposerMessage: boolean;
  composerDocuments: AssistantComposerDocument[];
  isPreparingDocuments: boolean;
  errorMessage: string | null;

  sendMessage: (
    message: string,
    documentAttachments?: AssistantDocumentAttachmentPart[],
  ) => Promise<void>;
  selectComposerDocuments: (documents: File[]) => Promise<void>;
  retryComposerDocument: (clientDocumentID: string) => Promise<void>;
  removeComposerDocument: (clientDocumentID: string) => Promise<void>;
  retryMessage: () => Promise<void>;
  loadOlderMessages: () => Promise<void>;
  commitDraft: (draftVersion: number) => Promise<void>;
  createNewThread: () => Promise<void>;
  clearError: () => void;
}

export interface SurveyBuilderAssistantProviderProps {
  children: ReactNode;
  surveyID: string;
}

export interface PendingMessageRequest {
  clientMessageID: string;
  message: string;
  documentIDs?: string[];
  documentAttachments?: AssistantDocumentAttachmentPart[];
}

export interface PendingCommitRequest {
  draftVersion: number;
  idempotencyKey: string;
}

export interface ParsedApiError {
  status: number | string | null;
  code: string | null;
  message: string;
}

export interface ParsedAssistantApiError {
  status: number | string | null;
  code: string | null;
  message: string;
}

export interface OptimisticAssistantMessageInput {
  clientMessageID: string;
  message: string;
  sequence: number;
  documentAttachments?: AssistantDocumentAttachmentPart[];
}

export type SurveyOrderPreviewProps = {
  part: AssistantSurveyOrderPreviewPart;
};

export interface AssistantReplacementProposal {
  baseQuestionHash: string;
  replacedQuestionCount: number;
}
