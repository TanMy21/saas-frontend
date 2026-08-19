import { createContext, useContext } from "react";

import { SurveyBuilderAssistantContextValue } from "../../../types/surveyBuilderAssistant.types";

 


export const SurveyBuilderAssistantContext =
  createContext<SurveyBuilderAssistantContextValue | null>(null);

export const useSurveyBuilderAssistant = () => {
  const context = useContext(SurveyBuilderAssistantContext);

  if (!context) {
    throw new Error(
      "useSurveyBuilderAssistant must be used within SurveyBuilderAssistantProvider",
    );
  }

  return context;
};