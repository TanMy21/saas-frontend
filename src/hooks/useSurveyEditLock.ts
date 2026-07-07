import { RootState } from "../app/store";
import { useAppSelector } from "../app/typedReduxHooks";
import { SOFT_EDIT_MESSAGES, SURVEY_EDIT_LOCKED_MESSAGE } from "../utils/constants";
import { showToast } from "../utils/showToast";
import { useEditLockConfirm } from "./useEditLockConfirm";
 

export const useSurveyEditLock = () => {
  const hasResponses = useAppSelector(
    (state: RootState) => state.surveyCanvas.hasResponses,
  );

  const isEditLocked = useAppSelector(
    (state: RootState) => state.surveyCanvas.isEditLocked,
  );

  const confirmLockedEdit = useEditLockConfirm();

  const guardStrictEdit = () => {
    if (!isEditLocked) return true;

    showToast.error(SURVEY_EDIT_LOCKED_MESSAGE);
    return false;
  };

const confirmSoftEdit = async (message: string) => {
  if (!isEditLocked) return true;

  return confirmLockedEdit({
    message,
    title: "Continue with this change?",
    confirmText: "OK",
    cancelText: "Cancel",
  });
};

  return {
    hasResponses,
    isEditLocked,
    guardStrictEdit,
    confirmSoftEdit,
    softMessages: SOFT_EDIT_MESSAGES,
  };
};