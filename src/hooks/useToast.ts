import { useEffect, useRef } from "react";

import { UseMutationToastParams } from "../types/uiTypes";
import { showToast } from "../utils/showToast";

export const useToast = ({
  isSuccess = false,
  isError = false,
  error,
  successMessage,
  errorFallbackMessage,
  successToastOptions,
  errorToastOptions,
  onSuccess,
  onError,
}: UseMutationToastParams) => {
  const hasHandledSuccessRef = useRef(false);
  const hasHandledErrorRef = useRef(false);

  /**
   * Resets the internal guards once the mutation state becomes idle again.
   * This lets the hook work correctly for repeated submissions.
   */
  useEffect(() => {
    if (!isSuccess) {
      hasHandledSuccessRef.current = false;
    }

    if (!isError) {
      hasHandledErrorRef.current = false;
    }
  }, [isSuccess, isError]);

  /**
   * Handles success exactly once per mutation result.
   */
  useEffect(() => {
    if (!isSuccess || hasHandledSuccessRef.current) {
      return;
    }

    hasHandledSuccessRef.current = true;

    if (successMessage) {
      showToast.success(successMessage, successToastOptions);
    }

    onSuccess?.();
  }, [isSuccess, successMessage, successToastOptions, onSuccess]);

  /**
   * Handles error exactly once per mutation result.
   */
  useEffect(() => {
    if (!isError || hasHandledErrorRef.current) {
      return;
    }

    hasHandledErrorRef.current = true;

    showToast.apiError(error, {
      fallbackMessage: errorFallbackMessage,
      ...errorToastOptions,
    });

    onError?.();
  }, [isError, error, errorFallbackMessage, errorToastOptions, onError]);
};
