import toast, { ToastOptions } from "react-hot-toast";

import { ApiErrorToastOptions } from "../types/uiTypes";

import { getSafeToastMessages } from "./safeToastMessage";

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, options);
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, options);
  },

  apiError: (error: unknown, options?: ApiErrorToastOptions) => {
    const { fallbackMessage, ...toastOptions } = options || {};

    const messages = getSafeToastMessages(error, fallbackMessage);

    messages.forEach((message) => {
      toast.error(message, toastOptions);
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast(message, options);
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, options);
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};
