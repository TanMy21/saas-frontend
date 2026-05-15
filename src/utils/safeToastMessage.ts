import { BackendErrorData } from "../types/uiTypes";

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const isUnsafeTechnicalMessage = (message: string): boolean => {
  const normalizedMessage = message.toLowerCase();

  const unsafePatterns = [
    "prisma",
    "node_modules",
    "stack",
    "at ",
    "error:",
    "typeerror",
    "referenceerror",
    "syntaxerror",
    "cannot read properties",
    "undefined",
    "null",
    "enoent",
    "econnrefused",
    "econnreset",
    "localhost",
    ".ts:",
    ".js:",
    "c:\\",
    "d:\\",
    "e:\\",
    "/src/",
    "/app/",
  ];

  return unsafePatterns.some((pattern) => normalizedMessage.includes(pattern));
};

const isSafeUserFacingMessage = (message: string): boolean => {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return false;
  }

  // Avoid absurdly long backend/internal messages appearing in toasts.
  if (trimmedMessage.length > 180) {
    return false;
  }

  return !isUnsafeTechnicalMessage(trimmedMessage);
};

/**
 * Converts any unknown API error into one or more safe toast messages.
 */
export const getSafeToastMessages = (
  error: unknown,
  fallbackMessage: string = DEFAULT_ERROR_MESSAGE,
): string[] => {
  if (!error) {
    return [fallbackMessage];
  }

  if (typeof error === "string") {
    return isSafeUserFacingMessage(error) ? [error] : [fallbackMessage];
  }

  if (typeof error === "object" && error !== null) {
    const possibleError = error as {
      data?: BackendErrorData;
      message?: string;
    };

    const errorData = possibleError.data;

    if (Array.isArray(errorData?.error)) {
      const safeValidationMessages = errorData.error
        .map((item) => item?.message?.trim())
        .filter(
          (message): message is string =>
            typeof message === "string" && isSafeUserFacingMessage(message),
        );

      if (safeValidationMessages.length > 0) {
        return safeValidationMessages;
      }
    }

    if (typeof errorData?.error === "string") {
      return isSafeUserFacingMessage(errorData.error)
        ? [errorData.error]
        : [fallbackMessage];
    }

    if (typeof errorData?.message === "string") {
      return isSafeUserFacingMessage(errorData.message)
        ? [errorData.message]
        : [fallbackMessage];
    }

    if (typeof possibleError.message === "string") {
      return isSafeUserFacingMessage(possibleError.message)
        ? [possibleError.message]
        : [fallbackMessage];
    }
  }

  return [fallbackMessage];
};
