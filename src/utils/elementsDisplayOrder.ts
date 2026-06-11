import { OrderedSurveyElement } from "../types/surveyBuilderTypes";

import { NON_NUMBERED_ELEMENT_TYPES } from "./constants";

export const isNumberedElement = (type?: string | null) => {
  if (!type) return false;

  return !NON_NUMBERED_ELEMENT_TYPES.has(type);
};



export const sortElementsByInternalOrder = <T extends OrderedSurveyElement>(
  elements: T[],
) => {
  return [...elements].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const createDisplayOrderMap = <T extends OrderedSurveyElement>(
  elements: T[],
) => {
  let visibleNumber = 0;
  const displayOrderMap = new Map<string, number>();

  sortElementsByInternalOrder(elements).forEach((element) => {
    if (!isNumberedElement(element.type)) return;

    visibleNumber += 1;
    displayOrderMap.set(element.questionID, visibleNumber);
  });

  return displayOrderMap;
};

export const getDisplayOrderForElement = <T extends OrderedSurveyElement>(
  element: T,
  displayOrderMap: Map<string, number>,
) => {
  if (!isNumberedElement(element.type)) return null;

  return displayOrderMap.get(element.questionID) ?? null;
};
