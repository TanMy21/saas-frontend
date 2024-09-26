import { MRT_ColumnDef } from "material-react-table";

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
  qNO?: string;
  type?: string;
  qText?: string;
  qDescription?: string;
  qType?: string;
  display?: string | null;
  qID?: string;
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
  required?: boolean;
  superSize?: boolean;
  welcomeText?: string;
}

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

export interface UserInfo {
  accessToken: string;
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
  workspaces: Workspace[];
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

export interface WorkspaceLayoutProps {
  surveys: Survey[];
  workspaceId: string;
  workspaceName: string;
  layout?: string;
}

export interface WorkspaceSurveysListCountProps {
  workspaceId?: string;
}
