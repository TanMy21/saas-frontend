import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { Element, SurveyBuilderState } from "../../utils/types";

const initialState: SurveyBuilderState = {
  elements: [],
  isShareModalOpen: false,
  isGenerateModalOpen: false,
};

export const surveyBuilderSlice = createSlice({
  name: "surveyBuilder",
  initialState,
  reducers: {
    setElements: (state, action: PayloadAction<Element[]>) => {
      state.elements = action.payload;
    },
    setShareModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isShareModalOpen = action.payload;
    },
    setGenerateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isGenerateModalOpen = action.payload;
    },
    addElement: (state, action: PayloadAction<Element>) => {
      state.elements.push(action.payload);
    },
    deleteElementRedux: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter(
        (el) => el.questionID !== action.payload
      );
    },
    updateElementOrder: (state, action: PayloadAction<Element[]>) => {
      state.elements = action.payload;
    },
    updateElementField: <K extends keyof Element>(
      state: SurveyBuilderState,
      action: PayloadAction<{ questionID: string; key: K; value: Element[K] }>
    ) => {
      const element = state.elements.find(
        (el) => el.questionID === action.payload.questionID
      );
      if (element) {
        element[action.payload.key] = action.payload.value;
      }
    },
  },
});

export const {
  setElements,
  setShareModalOpen,
  setGenerateModalOpen,
  addElement,
  deleteElementRedux,
  updateElementOrder,
  updateElementField,
} = surveyBuilderSlice.actions;

export default surveyBuilderSlice.reducer;
