import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { SurveyBuilderState } from "../../types/surveyBuilderTypes";
import { Element } from "../../utils/types";

const initialState: SurveyBuilderState = {
  elements: [],
  isShareModalOpen: false,
  activeContextPanel: "settings",
  assistantOpenRequestID: 0,
};

export const surveyBuilderSlice = createSlice({
  name: "surveyBuilder",
  initialState,
  reducers: {
    openSurveyBuilderAssistant: (state) => {
      state.activeContextPanel = "assistant";
      state.assistantOpenRequestID += 1;
    },

    openSurveyBuilderSettings: (state) => {
      state.activeContextPanel = "settings";
      state.assistantOpenRequestID += 1;
    },

    toggleSurveyBuilderAssistant: (state) => {
      if (state.activeContextPanel === "assistant") {
        state.activeContextPanel = "settings";
        return;
      }

      state.activeContextPanel = "assistant";
      state.assistantOpenRequestID += 1;
    },

    setElements: (state, action: PayloadAction<Element[]>) => {
      state.elements = action.payload;
    },
    setShareModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isShareModalOpen = action.payload;
    },

    addElement: (state, action: PayloadAction<Element>) => {
      state.elements.push(action.payload);
    },
    deleteElementRedux: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter(
        (el) => el.questionID !== action.payload,
      );
    },
    updateElementOrder: (state, action: PayloadAction<Element[]>) => {
      state.elements = action.payload;
    },
    updateElementField: <K extends keyof Element>(
      state: SurveyBuilderState,
      action: PayloadAction<{ questionID: string; key: K; value: Element[K] }>,
    ) => {
      const element = state.elements.find(
        (el) => el.questionID === action.payload.questionID,
      );

      if (!element) return;

      const key = action.payload.key;

      // merge objects instead of replacing
      if (typeof element[key] === "object" && element[key] !== null) {
        element[key] = {
          ...(element[key] as object),
          ...(action.payload.value as object),
        } as Element[K];
      } else {
        element[key] = action.payload.value;
      }
    },
  },
});

export const {
  setElements,
  setShareModalOpen,

  addElement,
  deleteElementRedux,
  updateElementOrder,
  updateElementField,
  openSurveyBuilderAssistant,
  openSurveyBuilderSettings,
  toggleSurveyBuilderAssistant,
} = surveyBuilderSlice.actions;

export default surveyBuilderSlice.reducer;
