export type AuthInitialState = {
  token: string | null;
};

export interface AuthResponse {
  accessToken?: string;
  isLoggedIn: boolean;
}

export interface AuthState {
  token?: string | null;
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

export interface Element {
  questionID: string;
  relatedSurveyId: string;
  creatorId: string;
  text: string;
  type: string;
  order?: number;
  minOptions: number;
  maxOptions: number;
  required: boolean;
}

export interface ElementProps {
  qNO: string;
  type?: string;
  qText?: string;
  qType?: string;
  display?: string | null;
  qID: string;
}

export interface ElementDropDownMenuProps {
  questionID: string;
  refetch: () => void;
}

export interface ElementType {
  questionID?: string;
  type: string;
  icon: JSX.Element;
  text: string;
  order?: number;
  Element?: React.ComponentType<ElementProps>;
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
  // handleElementClick: (element: ElementType, index: number) => void;
  // setElements: React.Dispatch<React.SetStateAction<ElementType[]>>;
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

export interface LoginFormData {
  email: string;
  password: string;
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

export interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  organization: string;
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
  handleLayoutChange: (
    _event: React.MouseEvent<HTMLElement>,
    display: string | null
  ) => void;
  // elementDetail: ElementType;
  // qIndex: string;
}

export interface SurveyBuilderLeftSidebarProps {
  surveyID?: string;
  setQuestionId?: React.Dispatch<React.SetStateAction<string | null>>;
  // setElementDetail: React.Dispatch<React.SetStateAction<ElementType>>;
  // setQIndex: React.Dispatch<React.SetStateAction<string>>;
  // setElements: React.Dispatch<React.SetStateAction<ElementType[]>>;
  // elements: ElementType[];
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
  display: string | null;
  // headerTabValue: number;
  handleLayoutChange: (
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
