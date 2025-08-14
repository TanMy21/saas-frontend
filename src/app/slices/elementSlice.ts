import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { Element, QuestionState } from "../../utils/types";

const initialState: QuestionState = {
  selectedQuestion: null,
  is3DModelModalOpen: false,
  showQuestion: false,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestion: (state, action: PayloadAction<Element>) => {
      state.selectedQuestion = action.payload;
    },
    setTemplateImage: (state, action: PayloadAction<{ url: string }>) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      state.selectedQuestion.questionPreferences = {
        ...state.selectedQuestion.questionPreferences,
        questionImageTemplate: true,
        questionImageTemplateUrl: action.payload.url,
      };
    },
    setBackgroundColor: (state, action: PayloadAction<string | null>) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      state.selectedQuestion.questionPreferences.questionBackgroundColor =
        action.payload;
    },

    removeBackgroundColor: (state) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      state.selectedQuestion.questionPreferences.questionBackgroundColor = null;
    },
    removeTemplateImage: (state) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      state.selectedQuestion.questionPreferences.questionImageTemplate = false;
      state.selectedQuestion.questionPreferences.questionImageTemplateUrl =
        undefined;
    },
    setImageWidth: (state, action: PayloadAction<number>) => {
      if (state.selectedQuestion) {
        state.selectedQuestion.questionImageWidth = action.payload;
      }
    },
    setImageHeight: (state, action: PayloadAction<number>) => {
      if (state.selectedQuestion) {
        state.selectedQuestion.questionImageHeight = action.payload;
      }
    },
    set3DModelModalOpen: (state, action: PayloadAction<boolean>) => {
      state.is3DModelModalOpen = action.payload;
    },
    setImageAltText: (state, action: PayloadAction<string>) => {
      if (state.selectedQuestion) {
        state.selectedQuestion.questionImageAltTxt = action.payload;
      }
    },
    toggleElementRequired: (state, action: PayloadAction<boolean>) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      if (!state.selectedQuestion.questionPreferences.required) {
        state.selectedQuestion.questionPreferences.required = false;
      }

      state.selectedQuestion.questionPreferences.required = action.payload;
    },
    toggleShowImage: (state, action: PayloadAction<boolean>) => {
      if (state.selectedQuestion) {
        state.selectedQuestion.questionImage = action.payload;
      }
    },
    toggleShowQuestionfor3dType: (state, action: PayloadAction<boolean>) => {
      if (state.selectedQuestion) {
        state.showQuestion = action.payload;
      }
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
    updateBinaryButtonTextYes: (state, action: PayloadAction<string>) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      if (!state.selectedQuestion.questionPreferences.uiConfig) {
        state.selectedQuestion.questionPreferences.uiConfig = {};
      }

      state.selectedQuestion.questionPreferences.uiConfig.buttonTextYes =
        action.payload;
    },
    updateBinaryButtonTextNo: (state, action: PayloadAction<string>) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      if (!state.selectedQuestion.questionPreferences.uiConfig) {
        state.selectedQuestion.questionPreferences.uiConfig = {};
      }

      state.selectedQuestion.questionPreferences.uiConfig.buttonTextNo =
        action.payload;
    },

    updateMinValue: (state, action: PayloadAction<number>) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      if (!state.selectedQuestion.questionPreferences.uiConfig) {
        state.selectedQuestion.questionPreferences.uiConfig = {};
      }

      state.selectedQuestion.questionPreferences.uiConfig.minValue =
        action.payload;
    },

    updateMaxValue: (state, action: PayloadAction<number>) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      if (!state.selectedQuestion.questionPreferences.uiConfig) {
        state.selectedQuestion.questionPreferences.uiConfig = {};
      }

      state.selectedQuestion.questionPreferences.uiConfig.maxValue =
        action.payload;
    },
    resetQuestion: () => initialState,
  },
});

export const {
  setQuestion,
  setTemplateImage,
  setBackgroundColor,
  set3DModelModalOpen,
  removeBackgroundColor,
  removeTemplateImage,
  setImageHeight,
  setImageWidth,
  setImageAltText,
  toggleElementRequired,
  toggleShowImage,
  toggleShowQuestionfor3dType,
  updateMinValue,
  updateMaxValue,
  updateUIButtonText,
  updateBinaryButtonTextYes,
  updateBinaryButtonTextNo,
  updateQuestionField,
  resetQuestion,
} = questionSlice.actions;

export default questionSlice.reducer;
