import { ToastOptions } from "react-hot-toast";

export type UseMutationToastParams = {
  isSuccess?: boolean;
  isError?: boolean;
  error?: unknown;

  successMessage?: string;
  errorFallbackMessage?: string;

  successToastOptions?: ToastOptions;
  errorToastOptions?: ToastOptions;

  onSuccess?: () => void;
  onError?: () => void;
};

export type ApiErrorToastOptions = ToastOptions & {
  fallbackMessage?: string;
};


export type BackendValidationError = {
  message?: string;
};

 
export type BackendErrorData = {
  message?: string;
  error?: BackendValidationError[] | string;
};