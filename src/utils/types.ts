import { type Edge, type Node } from "@xyflow/react";
import type { JwtPayload } from "jwt-decode";
import type { MRT_ColumnDef } from "material-react-table";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IconType } from "react-icons/lib";


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
export interface DownloadResponsesModalProps {
  setResponsesData: React.Dispatch<React.SetStateAction<string>>;
  setDownloadFileFormat: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  handleClose: () => void;
  rowData: RowData[];
  columns: MRT_ColumnDef<RowData>[];
}

export interface DashBoardHeaderProps {
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
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
  creatorId: string;
  text: string;
  type: string;
  order?: number;
  response: ElementResponse[];
  minOptions: number;
  maxOptions: number;
  required: boolean;
}

export interface ElementProps {
  qNO: string;
  type?: string;
  qText: string;
  qDescription: string;
  qType: string;
  display?: string | null;
  qID: string;
  qOptions?: OptionType[];
  qRequired?: boolean;
  qSettings?: QuestionSetting;
}

export interface ElementDropDownMenuProps {
  questionID: string;
  elements: Element[];
  refetch: () => void;
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
  elements?: ElementType[];
  surveyID: string;
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
  qNO?: string;
  qText: string;
  qDescription?: string;
  qType?: string;
  qOptions?: OptionType[];
  qRequired?: boolean;
  qSettings?: QuestionSetting;
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

export interface InsightCardProps {
  type: string;
  title: string;
  value: string | number;
  description: string;
  icon: IconType;
  iconColor: string;
}

export interface MediaElementCardProps {
  text: string;
  option: OptionType;
}

export interface MediaElementCardIconBtnProps {
  optionID: string;
  handleOpen: (optionID: string) => void;
  isHovered: string | null;
}

export interface MediaElementImageUploadModalProps {
  open: boolean;
  handleClose: () => void;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  selectedOptionID: string | null;
  uploadImage: (params: {
    formData: FormData;
    optionID: string | null;
  }) => void;
  isLoading: boolean;
}

export interface MediaElementMediaProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  optionID: string;
  image: string;
}
export interface NewSurveyModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceId: string;
  workspaceName: string;
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

export interface Questions {
  questionID: string;
  relatedSurveyId: string;
  text: string;
  description: string;
  type: string;
  order: number;
  required: boolean;
  response: QuestionResponse[];
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
  description?: string;
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
  questions: Questions[];
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
  display: string | null;
  survey?: Survey;
  questionId: string | null;
  handleLayoutChange?: (
    _event: React.MouseEvent<HTMLElement>,
    display: string | null
  ) => void;
}

export interface SurveyBuilderLeftSidebarProps {
  surveyID?: string;
  setQuestionId?: React.Dispatch<React.SetStateAction<string | null>>;
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
  tabValue?: string | null;
  handleScreenChange?: (
    _event: React.SyntheticEvent,
    display: string | null
  ) => void;
}

export interface SurveyWelcomeElementProps {
  display: string | null;
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

export interface Workspace {
  createdAt: string;
  description: string;
  isActive: boolean;
  name: string;
  workspaceName: string;
  ownerId: string;
  updatedAt: string;
  visibility: string;
  workspaceId?: string;
}

export interface WorkspacesProp {
  workspaces?: Workspace[];
  handleOpen: () => void;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface WorkspaceRenameModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId?: string;
  workspaceName?: string;
}

export interface WorkspaceDeleteModalProps {
  open: boolean;
  onClose: () => void;
  wsID?: string;
  wsName?: string;
  workspaceName?: string;
}

export interface WorkspaceData {
  workspaceName?: string;
}

export type WorkspaceDropdownOutletContextType = {
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
};

export interface WorkspaceLayoutProps {
  surveys: Survey[];
  workspaceId: string;
  workspaceName: string;
  layout?: string;
}

export interface WorkspaceSurveysListCountProps {
  workspaceId?: string;
}

export interface NewWorkspaceModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
