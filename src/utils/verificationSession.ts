import {
  RESEND_AVAILABLE_AT_KEY,
  RESEND_COOLDOWN_MS,
  VERIFICATION_EMAIL_KEY,
} from "./constants";
import { ApiError } from "./types";

export const savePendingVerificationEmail = (email: string): void => {
  sessionStorage.setItem(VERIFICATION_EMAIL_KEY, email.trim());
};

export const getPendingVerificationEmail = (): string | null => {
  const email = sessionStorage.getItem(VERIFICATION_EMAIL_KEY)?.trim();
  return email || null;
};

export const startVerificationResendCooldown = (): void => {
  sessionStorage.setItem(
    RESEND_AVAILABLE_AT_KEY,
    String(Date.now() + RESEND_COOLDOWN_MS),
  );
};

export const getVerificationResendSeconds = (): number => {
  const availableAt = Number(
    sessionStorage.getItem(RESEND_AVAILABLE_AT_KEY) ?? 0,
  );

  return Math.max(0, Math.ceil((availableAt - Date.now()) / 1000));
};

export const clearPendingVerification = (): void => {
  sessionStorage.removeItem(VERIFICATION_EMAIL_KEY);
  sessionStorage.removeItem(RESEND_AVAILABLE_AT_KEY);
};

export const getVerificationErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;

  if (apiError?.status === 429) {
    return "Too many verification attempts. Try again later.";
  }

  const errorCode = apiError?.data?.code ?? apiError?.data?.error;

  if (apiError?.status === 400 || errorCode === "INVALID_OR_EXPIRED_OTP") {
    return (
      "The verification code is invalid or has expired. " +
      "Request a new code and try again."
    );
  }

  return "We couldn't verify your email. Please try again.";
};

export const getResendErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;

  if (apiError?.status === 429) {
    return "Too many resend requests. Try again later.";
  }

  return "We couldn't request another code. Please try again.";
};
