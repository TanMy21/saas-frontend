export type LoaderMode = "INITIAL" | "APPEND" | "REPLACE";

export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: number;
}

export interface DangerModalShellProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface DangerModalHeaderProps {
  title: string;
  onClose: () => void;
}

export interface ConfirmationInputProps {
  expectedText: string;
  confirmationText: string;
  confirmationMatch: boolean;
  control: any;
  errors: any;
  touchedFields: any;
}

export interface DangerActionButtonProps {
  onClose: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  confirmationMatch?: boolean;
}

export type FieldConfig = {
  name: string;
  control: any;
  rules?: any;
  errors: any;
  touchedFields: any;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  [key: string]: any;
};
