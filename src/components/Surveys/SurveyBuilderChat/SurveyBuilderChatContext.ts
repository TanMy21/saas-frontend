import { createContext, useContext } from "react";

import type { SurveyBuilderChatContextValue } from "./surveyBuilderChat.types";

export const SurveyBuilderChatContext =
  createContext<SurveyBuilderChatContextValue | null>(null);

export const useSurveyBuilderChat = () => {
  const context = useContext(SurveyBuilderChatContext);
  if (!context) {
    throw new Error(
      "useSurveyBuilderChat must be used within SurveyBuilderChatProvider",
    );
  }
  return context;
};
