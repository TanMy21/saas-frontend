import { RefObject } from "react";

import { type SxProps, type Theme, type TooltipProps } from "@mui/material";
import { type QueryActionCreatorResult } from "@reduxjs/toolkit/query";
import { type Edge, type Node } from "@xyflow/react";
import { Dayjs } from "dayjs";
import type { JwtPayload } from "jwt-decode";
import type { MRT_ColumnDef } from "material-react-table";
import { type DroppableProvided } from "react-beautiful-dnd";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { type IconType } from "react-icons/lib";
import { type NavigateFunction } from "react-router-dom";
import * as THREE from "three";
import { z } from "zod";

import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendLogoutMutation,
} from "../app/slices/authApiSlice";
import { useImportQuestionsMutation } from "../app/slices/elementApiSlice";
import { useResendVerificationEmailMutation } from "../app/slices/userApiSlice";

import { generateSurveySchema } from "./schema";

export type AppErrorBoundaryProps = Readonly<{
  readonly children: React.ReactNode;
}>;

export type AuthInitialState = {
  token: string | null;
};

export interface AuthResponse {
  accessToken?: string;
  isLoggedIn: boolean;
}

export interface AuthState {
  token?: string | null;
  _id?: string | null;
  email?: string | null;
  isAdmin?: boolean | null;
  accessToken?: string | null;
  isLoggedIn?: boolean;
  restoringSession?: boolean;
}

export interface AddElementMenuProps {
  surveyID: string;
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleClose: () => void;
  handleElementAdd?: (menuOption: string) => void;
}
export interface RowData {
  participantID: string;
  [questionID: string]: unknown;
}

export interface BuilderSpaceProps {
  questionId: string | null;
  Elements?: Element[];
  display: "desktop" | "mobile";
  setDisplay: React.Dispatch<React.SetStateAction<string | null>>;
  noElements: boolean;
}

export type AccountSettingsFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

export type NotificationSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
};

export type TabId = "general" | "security" | "notifications" | "subscription";

export interface BinaryResponseProps {
  questionID?: string;
  buttonTextYes?: string;
  buttonTextNo?: string;
  index?: number;
  display?: "desktop" | "mobile";
}

export interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
}

export interface CanvasConsoleProps {
  display: "desktop" | "mobile";
  setDisplay: React.Dispatch<React.SetStateAction<"desktop" | "mobile">>;
  onOpenImport: () => void;
  question: Element | null;
  shareID: string;
  published: boolean;
  noElements: boolean;
}

export interface DownloadResponsesModalProps {
  setResponsesData: React.Dispatch<React.SetStateAction<string>>;
  setDownloadFileFormat: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  handleClose: () => void;
  rowData: RowData[];
  columns: MRT_ColumnDef<RowData>[];
}

export interface DashBoardHeaderProps {
  selectedWorkspace: Workspace;
  setSelectedWorkspace: React.Dispatch<
    React.SetStateAction<Workspace | undefined>
  >;
  setStepIndex?: React.Dispatch<React.SetStateAction<number>>;
  setNewWorkspaceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRenameWorkspaceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteWorkspaceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DockItemProps {
  icon: JSX.Element;
  action: () => void;
  label: string;
  isHovered: boolean;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
  id: string;
  withDividerLeft?: boolean;
}

export interface Condition {
  flowConditionID: string;
  relatedQuestionID: string;
  goto_questionID: string;
  conditionType: string;
  conditionValue?: string | null;
}

export interface ICustomEdge extends Edge {
  immutable?: boolean;
}

export type DashboardTourProps = {
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
  runTour: boolean;
  setRunTour: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface DeleteQuestionAlertProps {
  open: boolean;
}

export interface EnterToEditTooltipProps {
  children: React.ReactElement;
  open: boolean;
  onOpenChange?: (next: boolean) => void;
  title?: React.ReactNode;
  placement?: TooltipProps["placement"];
  tooltipSx?: SxProps<Theme>;
  disableHoverListener?: boolean;
  disableTouchListener?: boolean;
  autoHideMs?: number;
}

export interface EdgeFormData {
  sourceQuestionID: string;
  sourceQuestionOrder: number;
  sourceQuestionText: string;
  sourceQuestionIcon: string;
  source: number;
  target: number;
}

export type Model3D = {
  model3DID: string;
  relatedQuestionID: string;
  name: string;
  fileUrl: string;
  posterUrl: string;
  public_id: string;
  format: string;
  sizeBytes: number;
  polycount: number;
  materialCount: number;
  width: number;
  height: number;
  depth: number;
  draco: boolean;
  ktx2: boolean;
  showQuestion: boolean;
};

export interface ThreeDViewProps {
  url: string;
  display?: "desktop" | "mobile";
  showQuestion?: boolean;
}

export interface Interactive3DModelViewerProps {
  src: string;
  hdrEnvUrl?: string;
  height?: number;
  background?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  maxPolarAngle?: number;
  initialView?: ViewName;
  frontIsNegZ?: boolean;
}

export interface Element {
  questionID: string;
  relatedSurveyId: string;
  description: string;
  creatorId: string;
  text: string;
  type: string;
  order?: number;
  questionPreferences: SurveyCanvasQuestionSettings;
  Model3D: Model3D;
  questionImage?: boolean;
  questionImageUrl?: string;
  questionImageAltTxt?: string;
  questionImagePublicId?: string;
  questionImageWidth?: number;
  questionImageHeight?: number;
  response: ElementResponse[];
  minOptions: number;
  maxOptions: number;
  options?: OptionType[];
  required: boolean;
}

export interface ElementListItemProps {
  elements?: Element[];
  displayedQuestions: Element[];
  provided: DroppableProvided;
  nonOrderableTypes: string[];
  setQuestionId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface ElementProps {
  qNO?: string;
  type?: string;
  qText?: string;
  qDescription?: string;
  qType?: string;
  qImage?: boolean;
  showQuestion?: boolean;
  display?: "mobile" | "desktop";
  qID?: string;
  question?: Element | null;
  qOptions?: OptionType[];
  qRequired?: boolean;
  qSettings?: QuestionSetting;
  qPreferences?: SurveyCanvasQuestionSettings;
}

export interface ElementDropDownMenuProps {
  questionID: string;
  elements?: Element[];

  setQuestionId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface ElementType {
  questionID?: string;
  type: string;
  icon: JSX.Element;
  text: string;
  order?: number;
  Element?: React.ComponentType<ElementProps>;
  Settings?: React.ComponentType<ElementProps>;
}

interface ErrorMessage {
  message: string;
}

export interface EdgeStyleProps {
  value: EdgeStyle;
  onChange: (v: EdgeStyle) => void;
}

export interface FlowLayoutViewMenuProps {
  layout: LayoutMode;
  setLayout: (m: LayoutMode) => void;
  edgeStyle: EdgeStyle;
  setEdgeStyle: (s: EdgeStyle) => void;
}

export interface LayoutSwitcherPanelProps {
  value: LayoutMode;
  onChange: (m: LayoutMode) => void;
  modes?: LayoutMode[];
}

export interface ClusterOptions {
  getGroupId?: (n: Node) => string | undefined;
  padding?: number;
}

export type BypassInterval = { start: number; end: number };

export type EditTarget = "none" | "title" | "description";

export type LayoutMode = "sugiyama" | "vertical" | "swimlanes" | "clustered";

export type EdgeStyle = "straight" | "step" | "smoothstep" | "bezier";

export type LayoutResult = {
  nodes: Node[];
  edges: Edge[];
  overlays?: Node[];
};

export type EditControllerParams = {
  questionID?: string;
  text?: string;
  description?: string;
  updateElementText: (arg: { questionID?: string; text: string }) => void;
  updateElementDescription: (arg: {
    questionID?: string;
    description: string;
  }) => void;
};

export interface Modal3DModelProps {
  questionID?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export interface FileUploadProps {
  questionID: string;
  onFileSelect: (file: File) => void;
  onUploadSuccess?: (model: any) => void;
  onUploadError?: (message: string) => void;
}

export interface UploadState {
  isDragOver: boolean;
  isUploading: boolean;
  uploadProgress: number;
  uploadedFile: File | null;
  error: string | null;
}

export type OrderBadgeProps = {
  show: boolean;
  sizeMD: number;
  sizeXL: number;
  color: string;
  fontSize: number;
  value?: number;
};

export interface EditableLineProps {
  active: boolean;
  value?: string;
  placeholder?: string;
  onStartEdit: () => void;
  onChange?: (value: string) => void;
  onFormatted?: (nextHTML: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  textFieldId: string;
  typographySx: any;
  textFieldSx: any;
  cursorWhenActive?: "text" | "pointer";
  contentKey?: string | number;
  showFormatBar?: boolean;
}

export type FormatTagType = "strong" | "em" | "u";

export interface ScreenLayoutProps {
  children: React.ReactNode;
  className?: string;
  display?: "mobile" | "desktop";
  targetHeight?: number;
  heightOverride?: string;
  widthOverride?: string;
  marginBottomOveride?: string;
  marginTopOveride?: string;
}

export interface EditablePlainTextProps {
  value: string;
  placeholder?: string;
  onChange?: (nextPlain: string) => void;
  onEnter?: () => void;
  id?: string;
  sx?: any;
  blockEnter?: boolean;
}

export interface RichTextFieldProps {
  value?: string | null;
  onChange?: (html: string) => void;
  placeholder?: string;
  height?: number | string;
  sx?: SxProps;
  inputSx?: SxProps;
  id?: string;
  autoFocus?: boolean;
  contentKey?: string | number;
  blockEnter?: boolean;
  plainOnly?: boolean;
}

export type ErrorFallbackProps = Readonly<{
  error: Error;
  resetErrorBoundary: () => void;
}>;
export interface ElementsResponse {
  elements: ElementType[];
}

export interface ElementsPanelProps {
  elements?: Element[];
  surveyID?: string;
  setQuestionId?: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ElementResponse {
  responseID: string;
  relatedQuestionID: string;
  relatedOptionID?: string;
  participantID: string;
  questionType: string;
  surveyID: string;
  response: QuestionResponse;
}

export interface ElementSettingsProps {
  qID: string;
  question?: Element | null;
  qNO?: string;
  qText?: string;
  qDescription?: string;
  qType?: string;
  qOptions?: OptionType[];
  qRequired?: boolean;
  qSettings?: QuestionSetting;
  qPreferences?: SurveyCanvasQuestionSettings;
}

export interface ElementSettingsContainerProps {
  questionId: string | null;
  question: Element | null;
}

export interface ErrorData {
  data: {
    error?: ErrorMessage[];
    message?: string;
    status?: number;
  };
}

export interface errorsProp {
  errors?: string;
}

export interface FetchBaseQueryError {
  status: number;
  data?: {
    message?: string;
  };
}

export interface FontSizeControlProps {
  name: keyof TypographySettingsForm;
  label?: string;
  control: any;
  dispatchKey: keyof TypographySettingsForm;
  markFormTouched: () => void;
}

export interface FlowFormConditionBlockProps {
  condition: Condition;
  blockIndex: number;
  selectedNode: Node | null;
  questionID: string;
  edgeFormData: {
    sourceQuestionID: string;
    sourceQuestionOrder: number;
    sourceQuestionText: string;
    sourceQuestionIcon: string;
    source: number;
    target: number;
  };
  Elements: Element[];
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: any;
  setValue: any;
  setEdges: React.Dispatch<React.SetStateAction<ICustomEdge[]>>;
  setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
  // setTouchedConditions: React.Dispatch<
  //   React.SetStateAction<Record<number, boolean>>
  // >;
  errors: any;
  formErrors: FieldErrors<{
    conditions: {
      conditionValue?: {
        type: string;
        message: string;
        ref?: any;
      };
    }[];
  }>;
  isValid: boolean;
  hasSubmitted?: boolean;
  onAccordionClick: () => void;
}

export interface FlowConditionModalProps {
  nodes: Node[];
  edges: ICustomEdge[];
  openConditions: boolean;
  setOpenConditions: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  selectedNode: Node | null;
  // conditionBlocks: number[];
  // addConditionBlock: () => void;
  conditions: Condition[];
  errors: Record<number, string[]>;
  setErrors: React.Dispatch<React.SetStateAction<Record<number, string[]>>>;
  setEdges: React.Dispatch<React.SetStateAction<ICustomEdge[]>>;
  isValidArray: boolean[];
  setIsValidArray: React.Dispatch<React.SetStateAction<boolean[]>>;
  setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
  edgeFormData: {
    sourceQuestionID: string;
    sourceQuestionOrder: number;
    sourceQuestionText: string;
    sourceQuestionIcon: string;
    source: number;
    target: number;
  };
  refetch: () => QueryActionCreatorResult<any>;
  Elements: Element[];
}

export interface FlowFormProps {
  condition: Condition;
  questionID: string;
  questionType?: string;
  type?: string;
  setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
  control: Control<any>;
  register: UseFormRegister<any>;
  watch: any;
  setValue: any;
  formErrors?: FieldErrors<{
    conditions: {
      conditionValue?: {
        type: string;
        message: string;
        ref?: any;
      };
    }[];
  }>;
  blockIndex?: number;
  handleInteraction?: () => void;
}

export interface GridSurveyCardProps {
  survey: Survey;
  workspaceId: string;
  workspaceName: string;
  viewMode: "list" | "grid";
}

export interface SurveyCardMetricIndicatorProps {
  value: string;
  title: string;
}

export interface GenerateSurveyModalProps {
  openGenerate: boolean;
  setOpenGenerate?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface GenerateSurveyFormProps {
  surveyID: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClose: () => void;
}

export interface LocationStateProps {
  headerProps?: {
    tabValue?: string;
    workspaceId?: string;
    workspaceName?: string;
    survey?: Survey;
  };
  workspaceId?: string;
  workspaceName?: string;
  layout?: string;
  state?: { openModal: boolean; openModalImport: boolean };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ILogoutResponse {
  message: string;
}

export interface IconMapping {
  [key: string]: JSX.Element;
}

export interface ICustomePayload extends JwtPayload {
  UserInfo?: {
    email?: string;
    admin?: boolean;
    verified?: boolean;
  };
  exp?: number;
}

export interface ImportQuestionProps {
  isOpen?: boolean;
  onClose?: () => void;
  openImport?: boolean;
  setOpenImport?: React.Dispatch<React.SetStateAction<boolean>>;
  surveyID?: string;
}

export interface ImportQuestionModalInputFieldProps {
  surveyID: string;
  isLoading: boolean;
  importText: string;
  setImportText: React.Dispatch<React.SetStateAction<string>>;
  setImportBtnClicked: React.Dispatch<React.SetStateAction<boolean>>;
  importQuestions: ReturnType<typeof useImportQuestionsMutation>[0];
  handleClose: () => void;
}

export interface InsightCardProps {
  type: string;
  title: string;
  value: string | number;
  description: string;
  icon: IconType;
  iconColor: string;
}

export interface InputResponseProps {
  inputPlaceholder: string;
  submitButtonText: string;
  display?: "desktop" | "mobile";
}

export interface Language {
  id: string;
  code: string;
  name: string;
}

export interface MediaElementCardProps {
  text: string;
  option: OptionType;
}

export interface MediaElementCardIconBtnProps {
  optionID: string;
}

export interface MediaElementImageUploadModalProps {
  uploadImageModalOpen: boolean;
  setUploadImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  optionID: string;
}

export interface MediaElementMediaProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  optionID: string;
  image: string;
}

export interface MediaOptionsContainerProps {
  qID: string;
  display?: "desktop" | "mobile";
}

export interface MediaOptionProps {
  option: OptionType;
}

export interface NewSurveyActionCardProps {
  onClickHandler: () => void;
  icon: React.ReactElement;
  actionTitle: string;
  actionSubTitle: string;
}

type ResetPasswordTrigger = ReturnType<typeof useResetPasswordMutation>[0];

export interface NewPasswordFormProps {
  code: string;
  resetPassword: ResetPasswordTrigger;
}

export interface NewSurveyModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
}

export interface NewWorkspaceMenuOptionProps {
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  openModal?: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NodeData {
  questionID?: string;
  relatedSurveyId?: string;
  description?: string;
  creatorId?: string;
  text?: string;
  type?: string;
  order: number;
}

type ForgotPasswordTrigger = ReturnType<typeof useForgotPasswordMutation>[0];

export interface PasswordResetFormProps {
  setSubmittedEmail: React.Dispatch<React.SetStateAction<string>>;
  forgotPassword: ForgotPasswordTrigger;
  isLoading: boolean;
  isSuccess: boolean;
}

export interface PasswordResetSuccessProps {
  submittedEmail: string;
  reset: () => void;
}

export interface PublishButtonProps {
  surveyID: string;
  published: boolean;
}

export interface PublishSurveyAlertProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UIState {
  overlayOpen: boolean;
  overlayMessage?: string;
  publishAlertOpen?: boolean;
  shareModalOpen?: boolean;
}

export type QuestionTypeKey =
  | "BINARY"
  | "EMAIL_CONTACT"
  | "END_SCREEN"
  | "INSTRUCTIONS"
  | "MEDIA"
  | "NUMBER"
  | "RADIO"
  | "RANK"
  | "RANGE"
  | "TEXT"
  | "THREE_D"
  | "MULTIPLE_CHOICE"
  | "WELCOME_SCREEN";

export type QuestionType =
  | "BINARY"
  | "MEDIA"
  | "NUMBER"
  | "RADIO"
  | "RANK"
  | "RANGE"
  | "TEXT"
  | "THREE_D"
  | "MULTIPLE_CHOICE";

export interface QuestionDetail {
  questionID: string;
  type: QuestionTypeKey;
  text: string;
  order: number;
}

export interface QuestionFlowProps {
  surveyID: string;
  Elements: Element[];
  refetch: () => QueryActionCreatorResult<any>;
}

export interface QuestionFlowCondition {
  questionID: string;
  conditions: Condition[];
}

export interface Question {
  questionID: string;
  relatedSurveyId: string;
  // QuestionSettings: SurveyQuestionSettings;
  text: string;
  description: string;
  type: string;
  order: number;
  required: boolean;
  response: QuestionResponse[];
}

export interface QuestionImage {
  questionImage?: boolean;
  questionImageUrl?: string;
  questionImageAltTxt?: string;
  questionImageWidth?: number;
  questionImageHeight?: number;
}

export interface QuestionImageDimensionsFormProps {
  questionID?: string;
  questionImageWidth?: number;
  questionImageHeight?: number;
}

export interface QuestionImageUploadProps {
  questionID: string;
}

export interface ElementImageIconButtonsProps {
  questionID: string;
  colorAnchorEl: null | HTMLButtonElement;
  setColorAnchorEl: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
}

export interface ElementBackgroundPreferencesRemoveButtonsProps {
  questionID: string;
  templateImage: boolean;
  questionBackgroundColor: string;
}

export interface InsightsResponse {
  meta: {
    surveyID: string;
    surveyTitle: string;
    totalParticipants: number;
  };
  summary: {
    starts: number;
    completed: number;
    completionRate: number;
    dropOffRate: number;
    biggestDropOff: {
      questionID: string;
      text: string;
      order: number;
      dropOffRate: number;
    };
  };
  trends: {
    series: Array<{ date: string; value: number }>;
  };
  dropOffTable: Array<{
    questionID: string;
    order: number;
    text: string;
    type: string;
    reached: number;
    answered: number;
    dropped: number;
    dropOffRate: number;
    avgTimeMs: number;
  }>;
  questionDetails: Record<string, any>;
}

export interface QuestionImageUploadModalProps {
  uploadImageModalOpen: boolean;
  setUploadImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  questionID: string;
}

export interface SurveyCanvasQuestion {
  questionID: string;
  relatedSurveyId: string;
  questionPreferences: SurveyCanvasQuestionSettings;
  text: string;
  description: string;
  type: string;
  order: number;
  required: boolean;
  response: QuestionResponse[];
  options: OptionType[];
}

export interface QuestionUIConfig {
  buttonText?: string;
  buttonTextYes?: string;
  buttonTextNo?: string;
  minRange?: number;
  maxRange?: number;
  multipleSelection?: boolean;
  superSize?: boolean;
  minValue?: number;
  maxValue?: number;
}

export interface QuestionBackgroundColorProps {
  questionID: string;
  colorAnchorEl: null | HTMLButtonElement;
  setColorAnchorEl: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
}

export interface SurveyCanvasQuestionSettings {
  preferencesID: string;
  relatedQuestionID: string;
  creatorId: string;
  updaterId?: string;
  titleFontSize?: number;
  titleFontSizeMobile?: number;
  titleTextColor?: string;
  descriptionFontSize?: number;
  descriptionFontSizeMobile?: number;
  descriptionTextColor?: string;
  questionImageTemplate?: boolean;
  questionImageTemplateUrl?: string;
  questionImageTemplatePublicId?: string;
  questionBackgroundColor?: string | null;
  required?: boolean;
  uiConfig?: QuestionUIConfig;
}

export interface Mark {
  value: number;
  label?: string;
}

export interface StaticSliderConfig {
  tick: {
    minSize: number;
    increment: number;
  };
  segment: {
    minThickness: number;
    increment: number;
  };
  gap: number;
}

export interface QuestionSetting {
  buttonText?: string;
  button1Text?: string;
  button2Text?: string;
  instructionsTitle?: string;
  minValue?: number;
  minSwitch?: boolean;
  maxValue?: number;
  maxSwitch?: boolean;
  multipleSelection?: boolean;
  questionText?: string;
  questionDescription?: string;
  required?: boolean;
  showQuestion?: boolean;
  superSize?: boolean;
  welcomeText?: string;
}

export interface QuestionNodeData extends Record<string, unknown> {
  label: number;
  questionID: string;
  question: string;
  order: number;
  element: string;
}

export interface QuestionState {
  selectedQuestion: Element | null;
  is3DModelModalOpen: boolean;
}

export type QuestionNode = Node<QuestionNodeData>;

export interface QuestionResponse {
  responseID: string;
  relatedQuestionID: string;
  relatedOptionID: string;
  participantID: string;
  participant: any;
  relatedParticipantID?: string;
  response: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMenuOptionsProps {
  workspaceId?: string;
  workspaceName?: string;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  openModal?: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  organization: string;
}

export interface Participant {
  participantID: string;
  email?: string;
}

export interface ResultsResponse {
  surveyID: string;
  participants: Participant[];
  questions: Question[];
}

export interface ResponseListProps {
  qID: string;
  qType?: string;
  optionText: string;
  display?: "desktop" | "mobile";
}

export interface ResponseListItemProps {
  qType?: string;
  response: OptionType;
  index: number;
  display?: "desktop" | "mobile";
}

export interface ResetPassword {
  code: string;
}

export interface Replace3DModelModalProps {
  open: boolean;
  onClose: () => void;
  questionID: string;
  currentFileName?: string;
  onReplaced?: (file: File) => void;
}

export type Model3DParams = {
  readonly src: string;
  readonly onReady?: (root: THREE.Object3D) => void;
};

export type ViewName = "front" | "back" | "left" | "right" | "top" | "bottom";

export interface SetInitialViewParams {
  camera: THREE.PerspectiveCamera;
  controls: any;
  object: THREE.Object3D;
  view?: ViewName;
  fov?: number;
  aspect?: number;
  padding?: number;
  frontIsNegZ?: boolean;
}

export interface InitialViewParams {
  object: THREE.Object3D | null;
  initialView: ViewName;
  frontIsNegZ: boolean;
  controlsRef: React.RefObject<any>;
}

export interface SettingsFormData {
  title?: string;
  description?: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  responseLimit?: number;
  language: string;
  isTemplate?: boolean;
}

export interface SessionExpireToastProps {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly handleSessionExpired: () => void;
}

export interface SurveyTitleAndDescription {
  title: string;
  description: string;
}

export interface SnackbarAlertProps {
  openSnackbar: boolean;
  handleCloseSnackbar: (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => void;
}

export interface SuccessfullLogoutToastProps {
  showLogoutAlert: boolean;
  setShowLogoutAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Survey {
  createdAt: string;
  creatorId: string;
  description: string;
  email: string;
  endDate: string;
  isTemplate: boolean;
  language: string;
  responseLimit: number;
  sharedLink: string;
  startDate: string;
  published?: boolean;
  status: string;
  surveyID: string;
  shareID: string;
  surveyTag: string[];
  title: string;
  _count: {
    questions: number;
    behaviorSessions: number;
  };
  updatedAt: string;
  visibility: string;
  workspaceId: string;
}

export interface SurveyBuilderCanvasProps {
  display?: "desktop" | "mobile";
  question?: Element | null;
}

export interface SurveyBuilderState {
  elements: Element[];
  isShareModalOpen?: boolean;
  isGenerateModalOpen: boolean;
}

export interface SurveyBuilderLeftSidebarProps {
  surveyID?: string;
  setQuestionId?: React.Dispatch<React.SetStateAction<string | null>>;
  elements: Element[];
}

export interface SurveyListCardProps {
  survey: Survey;
  workspaceId: string;
  workspaceName: string;
  layout?: string;
}

export interface SurveyNameProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
  surveyID?: string;
  surveyName?: string;
  title?: string;
  description?: string;
  surveyDescription?: string;
  setSurveyTitle: React.Dispatch<React.SetStateAction<string>>;
}

export interface NewSurveyProps {
  workspaceId?: string;
  workspaceName?: string;
  viewMode?: "list" | "grid";
}

export interface OptionType {
  qID?: string;
  optionID: string;
  relatedQuestionID: string;
  creatorId: string;
  text: string;
  value: string;
  image: string;
  order: number;
}
export interface ScaleResponseProps {
  display?: "desktop" | "mobile";
}

export interface ScreenSettingsProps {
  qID?: string;
  qText?: string;
  qDescription?: string;
  qSettings?: QuestionSetting;
}

export interface ScreenTypographySettingsProps {
  qID: string;
  questionPreferences?: SurveyCanvasQuestionSettings;
}

export interface SurveysCollectionProps {
  surveys: Survey[];
  workspaceId?: string;
  workspaceName?: string;
  viewMode?: "list" | "grid" | undefined;
}

export interface SurveyRenameProps {
  open: boolean;
  onClose: () => void;
  survey?: Survey;
  sID?: string;
  sTitle?: string;
  surveyTitle?: string;
  confirmationText?: string;
  expectedText?: string;
}

export interface ShareSurveyProps {
  open: boolean;
  setShareBtnSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openSnackbar: boolean;
  shareID: string;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SurveySettingsProps {
  surveyID: string;
  openSettings: boolean;
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SurveyTitleEditModalProps {
  openEdit: boolean;
  setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SurveyIslandProps {
  setDisplay: React.Dispatch<React.SetStateAction<"desktop" | "mobile">>;
  onOpenImport: () => void;
  shareID: string;
  published: boolean;
}

export interface SurveyDropDownMenuProps {
  survey: Survey;
  workspaceId?: string;
  workspaceName?: string;
  title?: string;
}

export interface SurveyBuilderHeaderProps {
  survey: Survey;
  workspaceId?: string;
  workspaceName?: string;
  title?: string;
  tabValue?: string;
  surveyTitle?: string;
}

export interface SurveyBuilderHeaderTabsProps {
  tabValue: string;
  setTabValue: React.Dispatch<React.SetStateAction<string>>;
  survey: Survey;
  surveyID: string;
  workspaceId?: string;
  workspaceName?: string;
}

export interface SurveyCanvas {
  getSurveyCanvas: any;
  languages: any[];
}

export interface SurveyPreferencesPanelProps {
  questionId: string | null;
  question: Element | null;
}

export interface SurveySearchBarProps {
  search: string;
  matchMode: "AND" | "OR";
  setMatchMode: React.Dispatch<React.SetStateAction<"AND" | "OR">>;
  tagOnly: boolean;
  setTagOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setSearch: (query: string) => void;
}

export interface SurveySorterProps {
  sortBy: "Date created" | "Date updated" | "Alphabetically";
  setSortBy: React.Dispatch<
    React.SetStateAction<"Date created" | "Date updated" | "Alphabetically">
  >;
}

export interface SurveyTagsModalProps {
  open: boolean;
  onClose: () => void;
  survey: Survey;
}

export interface SurveyViewModeProps {
  viewMode: "grid" | "list";
  setViewMode: React.Dispatch<React.SetStateAction<"grid" | "list">>;
}

export interface SurveyWelcomeElementProps {
  display: "desktop" | "mobile";
}

export interface TypographySettingsForm {
  titleFontSize?: number;
  titleFontSizeMobile?: number;
  titleTextColor?: string;
  descriptionFontSize?: number;
  descriptionFontSizeMobile?: number;
  descriptionTextColor?: string;
}

export interface TypographySettingsView {
  view: "desktop" | "mobile";
  setView: React.Dispatch<React.SetStateAction<"desktop" | "mobile">>;
}

export interface UserInfo {
  accessToken: string;
}

type UserTours = {
  hasCompletedDashboardTour: boolean;
  hasSkippedDashboardTour: boolean;
  hasCompletedBuilderTour: boolean;
  hasSkippedBuilderTour: boolean;
};

export interface User {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  organization: string | null;
  verified: boolean | null;
  isAdmin: boolean | null;
  tours: UserTours;
}

export interface UpdateUserInfoFormData {
  firstname: string;
  lastname: string;
  email: string;
  // organization: string;
}

export interface VerificationEmailProps {
  email?: string;
}

type ResendVerificationEmailTrigger = ReturnType<
  typeof useResendVerificationEmailMutation
>[0];
type SendLogoutTrigger = ReturnType<typeof useSendLogoutMutation>[0];

export interface VerifyEmailCardProps {
  resendVerificationEmail: ResendVerificationEmailTrigger;
  sendLogout: SendLogoutTrigger;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  isSuccess: boolean;
  email: string;
  navigate: NavigateFunction;
}

export interface Workspace {
  createdAt: string;
  description: string;
  isActive: boolean;
  name: string;
  workspaceName?: string;
  ownerId: string;
  updatedAt: string;
  visibility: string;
  workspaceId?: string;
}

export interface SurveyCollectionsScrollNavProps {
  containerRef: RefObject<HTMLElement>;
  enabled: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  cooldownMs?: number;
  wheelThreshold?: number;
  touchThreshold?: number;
}

export interface WorkspaceDelete {
  workspaceId: string;
  workspaceName: string;
  confirmationText?: string;
}

export type WorkspaceConsoleProps = {
  selectedWorkspace: Workspace;
  setSelectedWorkspace: React.Dispatch<
    React.SetStateAction<Workspace | undefined>
  >;
  workspaceId?: string;
  workspaceName?: string;
  viewMode?: "list" | "grid";
  setViewMode?: React.Dispatch<React.SetStateAction<"list" | "grid">>;
  sortBy?: "Date created" | "Date updated" | "Alphabetically";
  setSortBy?: React.Dispatch<
    React.SetStateAction<"Date created" | "Date updated" | "Alphabetically">
  >;
};

export interface WorkspacesProp {
  workspaces?: Workspace[];
  handleOpen: () => void;
  setStepIndex?: React.Dispatch<React.SetStateAction<number>>;
}

export interface WorkspaceRenameModalProps {
  open: boolean;
  onClose: () => void;
  selectedWorkspace: Workspace;
  setSelectedWorkspace: React.Dispatch<
    React.SetStateAction<Workspace | undefined>
  >;
}

export interface WorkspaceRename {
  workspaceId: string;
  name: string;
}

export interface WorkspaceSurveysPaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (newPage: number) => void;
  viewMode: "list" | "grid";
}

export interface WorkspaceToolbarProps {
  workspaceId: string;
  workspaceName: string;
  viewMode: "list" | "grid";
  setViewMode: React.Dispatch<React.SetStateAction<"list" | "grid">>;
  sortBy: "Date created" | "Date updated" | "Alphabetically";
  setSortBy: React.Dispatch<
    React.SetStateAction<"Date created" | "Date updated" | "Alphabetically">
  >;
  search: string;
  matchMode: "AND" | "OR";
  setMatchMode: React.Dispatch<React.SetStateAction<"AND" | "OR">>;
  tagOnly: boolean;
  total: number;
  setTagOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setSearch: (query: string) => void;
  selectedWorkspace: Workspace;
  setSelectedWorkspace: React.Dispatch<
    React.SetStateAction<Workspace | undefined>
  >;
}

export interface WorkspaceDeleteModalProps {
  open: boolean;
  onClose: () => void;
  selectedWorkspace: Workspace;
}

export interface WorkspaceDropDownMenu {
  selectedWorkspace: Workspace;
  workspaceName?: string;
  setSelectedWorkspace: React.Dispatch<
    React.SetStateAction<Workspace | undefined>
  >;
}

export type WorkspaceDropdownOutletContextType = {
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
};

export type WorkspaceDropDownMenuProps = {
  selectedWorkspace: Workspace;
  setSelectedWorkspace: React.Dispatch<
    React.SetStateAction<Workspace | undefined>
  >;
  setNewWorkspaceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRenameWorkspaceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteWorkspaceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface WorkspaceLayoutProps {
  surveys: Survey[];
  workspaceId: string;
  workspaceName: string;
  viewMode: "list" | "grid";
}

export interface WorkspaceSurveysListCountProps {
  workspaceId?: string;
}

export interface NewWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
}

export type GenerateSurveyFormData = z.infer<typeof generateSurveySchema>;
