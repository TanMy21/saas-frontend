import { createContext, useContext } from "react";

import { ConfirmOptions } from "../types/surveyBuilderTypes";

export const SurveyEditLockConfirmContext = createContext<
  ((options: ConfirmOptions) => Promise<boolean>) | null
>(null);

export const useEditLockConfirm = () => {
  const context = useContext(SurveyEditLockConfirmContext);

  if (!context) {
    throw new Error(
      "useSurveyEditLockConfirm must be used inside SurveyEditLockConfirmProvider",
    );
  }

  return context;
};
