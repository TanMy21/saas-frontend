export type AuthInitialState = {
  token: string | null;
};

export interface AuthResponse {
  accessToken: string;
  isLoggedIn: boolean;
}

export interface AuthState {
  token: string | null;
  accessToken: string | null;
  isLoggedIn: boolean;
}

interface ErrorMessage {
  message: string;
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

export interface NewSurveyModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  organization: string;
}

export interface UserInfo {
  accessToken: string;
}

interface Workspace {
  createdAt: string;
  description: string;
  isActive: boolean;
  name: string;
  workspaceName: string;
  ownerId: string;
  updatedAt: string;
  visibility: string;
  workspaceId: string;
}

export interface WorkspacesProp {
  workspaces: Workspace[];
}

export interface WorkspaceData {
  workspaceName: string;
}
