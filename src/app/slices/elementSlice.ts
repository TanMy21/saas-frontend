import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { Element } from "../../utils/types";

interface QuestionState {
  selectedQuestion: Element | null;
}

const initialState: QuestionState = {
  selectedQuestion: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestion: (state, action: PayloadAction<Element>) => {
      state.selectedQuestion = action.payload;
    },
    updateQuestionField: <K extends keyof Element>(
      state: QuestionState,
      action: PayloadAction<{ key: K; value: Element[K] }>
    ) => {
      if (state.selectedQuestion) {
        state.selectedQuestion[action.payload.key] = action.payload.value;
      }
    },
    updateUIButtonText: (state, action: PayloadAction<string>) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      if (!state.selectedQuestion.questionPreferences.uiConfig) {
        state.selectedQuestion.questionPreferences.uiConfig = {};
      }

      state.selectedQuestion.questionPreferences.uiConfig.buttonText =
        action.payload;
    },
    toggleElementRequired: (state, action: PayloadAction<boolean>) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      if (!state.selectedQuestion.questionPreferences.required) {
        state.selectedQuestion.questionPreferences.required = false;
      }

      state.selectedQuestion.questionPreferences.required = action.payload;
    },
    resetQuestion: () => initialState,
  },
});

export const {
  setQuestion,
  updateQuestionField,
  updateUIButtonText,
  toggleElementRequired,
  resetQuestion,
} = questionSlice.actions;

export default questionSlice.reducer;
