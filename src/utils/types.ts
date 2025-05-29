import { type Edge, type Node } from "@xyflow/react";
import type { JwtPayload } from "jwt-decode";
import type { MRT_ColumnDef } from "material-react-table";
import { type DroppableProvided } from "react-beautiful-dnd";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { type IconType } from "react-icons/lib";
import { type NavigateFunction } from "react-router-dom";
import { z } from "zod";

import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendLogoutMutation,
} from "../app/slices/authApiSlice";
import { useImportQuestionsMutation } from "../app/slices/elementApiSlice";
import { useResendVerificationEmailMutation } from "../app/slices/userApiSlice";

import { generateSurveySchema } from "./schema";

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
  [key: string]: string;
}

export interface BuilderSpaceProps {
  questionId: string | null;
  Elements?: Element[];
  display: string | null;
  setDisplay: React.Dispatch<React.SetStateAction<string | null>>;
  noElements: boolean;
}

export interface BinaryResposneProps {
  questionID?: string;
  buttonTextYes?: string;
  buttonTextNo?: string;
  index?: number;
}

export interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
}

export interface CanvasConsoleProps {
  display: string | null;
  setDisplay: React.Dispatch<React.SetStateAction<string | null>>;
  question: Element | null;
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

export interface EdgeFormData {
  sourceQuestionID: string;
  sourceQuestionOrder: number;
  sourceQuestionText: string;
  sourceQuestionIcon: string;
  source: number;
  target: number;
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
  display?: string | null;
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
  register: UseFormRegister<any>;
  watch: any;
  setValue: any;
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

  Elements: Element[];
}

export interface FlowFormProps {
  condition: Condition;
  questionID: string;
  questionType?: string;
  type?: string;
  setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
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
  openImport?: boolean;
  setOpenImport?: React.Dispatch<React.SetStateAction<boolean>>;
  surveyID?: string;
}

export interface ImportQuestionModalInputFieldProps {
  surveyID: string;
  isLoading: boolean;
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
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceId: string;
  workspaceName: string;
}

export interface NewWorkspaceMenuOptionProps {
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  openModal?: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  | "MULTIPLE_CHOICE"
  | "WELCOME_SCREEN";

export interface QuestionDetail {
  questionID: string;
  type: QuestionTypeKey;
  text: string;
  order: number;
}

export interface QuestionFlowProps {
  surveyID: string;
  Elements: Element[];
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
  colorAnchorEl: null | HTMLElement;
  setColorAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export interface ElementBackgroundPreferencesRemoveButtonsProps {
  questionID: string;
  templateImage: boolean;
  questionBackgroundColor: string;
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
}

export interface QuestionBackgroundColorProps {
  questionID: string;
  colorAnchorEl: null | HTMLElement;
  setColorAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export interface SurveyCanvasQuestionSettings {
  preferencesID: string;
  relatedQuestionID: string;
  creatorId: string;
  updaterId?: string;
  titleFontSize?: number;
  titleFontColor?: string;
  descriptionFontSize?: number;
  descriptionFontColor?: string;
  questionImageTemplate?: boolean;
  questionImageTemplateUrl?: string;
  questionImageTemplatePublicId?: string;
  questionBackgroundColor?: string;
  required?: boolean;
  uiConfig?: QuestionUIConfig;
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

export type QuestionNode = Node<QuestionNodeData>;

export interface QuestionResponse {
  responseID: string;
  relatedQuestionID: string;
  relatedOptionID: string;
  participantID: string;
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

export interface ResultsResponse {
  surveyID: string;
  questions: Question[];
}

export interface ResponseListProps {
  qID: string;
  qType?: string;
  optionText: string;
}

export interface ResponseListItemProps {
  qType?: string;
  response: OptionType;
  index: number;
}

export interface ResetPassword {
  code: string;
}

export interface SettingsFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  responseLimit: number;
  language: string;
  isTemplate: boolean;
}

export interface SnackbarAlertProps {
  openSnackbar: boolean;
  handleCloseSnackbar: () => void;
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
  status: string;
  surveyID: string;
  surveyTag: string[];
  title: string;
  updatedAt: string;
  visibility: string;
  workspaceId: string;
}

export interface SurveyBuilderCanvasProps {
  display?: string | null;
  question?: Element | null;
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
}

export interface ShareSurveyProps {
  open: boolean;
  setShareBtnSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openSnackbar: boolean;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SurveySettingsProps {
  openSettings: boolean;
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SurveyIslandProps {
  setDisplay: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface SurveyDropDownMenuProps {
  survey: Survey;
  workspaceId?: string;
  workspaceName?: string;
  title?: string;
}

export interface SurveyBuilderHeaderProps {
  survey: Survey;
  workspaceId: string;
  workspaceName: string;
  title: string;
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
  display: string | null;
}

export interface TypographySettingsForm {
  titleFontSize: number;
  titleFontColor: string;
  descriptionFontSize: number;
  descriptionFontColor: string;
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

export interface WorkspaceDelete {
  workspaceId: string;
  workspaceName: string;
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
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type GenerateSurveyFormData = z.infer<typeof generateSurveySchema>;
