import { createContext, useContext } from "react";

export const SurveyCanvasRefetchContext = createContext<() => void>(() => {});
export const useSurveyCanvasRefetch = () =>
  useContext(SurveyCanvasRefetchContext);
