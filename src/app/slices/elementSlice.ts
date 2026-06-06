import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { Element, QuestionState } from "../../utils/types";

const initialState: QuestionState = {
  selectedQuestion: null,
  selectedQuestionId: null,
  is3DModelModalOpen: false,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestion: (state, action: PayloadAction<Element>) => {
      state.selectedQuestion = action.payload;
      state.selectedQuestionId = action.payload.questionID;
    },
    setSelectedQuestionId: (state, action: PayloadAction<string | null>) => {
      state.selectedQuestionId = action.payload;
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

      const newColor = action.payload;

      state.selectedQuestion.questionPreferences.questionBackgroundColor =
        newColor;
    },

    removeBackgroundColor: (state) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      state.selectedQuestion.questionPreferences = {
        ...state.selectedQuestion.questionPreferences,
        questionBackgroundColor: "#ffffff",
      };
    },
    removeTemplateImage: (state) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      state.selectedQuestion.questionPreferences.questionImageTemplate = false;
      state.selectedQuestion.questionPreferences.questionImageTemplateUrl =
        undefined;
    },
    setImageWidth: (state, action: PayloadAction<number>) => {
      if (state.selectedQuestion?.questionImages?.[0]) {
        state.selectedQuestion.questionImages[0].width = action.payload;
      }
    },
    setImageHeight: (state, action: PayloadAction<number>) => {
      if (state.selectedQuestion?.questionImages?.[0]) {
        state.selectedQuestion.questionImages[0].height = action.payload;
      }
    },
    set3DModelModalOpen: (state, action: PayloadAction<boolean>) => {
      state.is3DModelModalOpen = action.payload;
    },
    setImageAltText: (state, action: PayloadAction<string>) => {
      if (state.selectedQuestion?.questionImages?.[0]) {
        state.selectedQuestion.questionImages[0].altText = action.payload;
      }
    },

    setConceptFitDisplayMode: (
      state,
      action: PayloadAction<"TEXT" | "IMAGE">,
    ) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      if (!state.selectedQuestion.questionPreferences.uiConfig) {
        state.selectedQuestion.questionPreferences.uiConfig = {};
      }

      state.selectedQuestion.questionPreferences.uiConfig.conceptDisplayMode =
        action.payload;
    },

    setTimedChoiceDisplayMode: (
      state,
      action: PayloadAction<"TEXT" | "IMAGE">,
    ) => {
      if (!state.selectedQuestion?.questionPreferences) return;

      if (!state.selectedQuestion.questionPreferences.uiConfig) {
        state.selectedQuestion.questionPreferences.uiConfig = {};
      }

      state.selectedQuestion.questionPreferences.uiConfig.timedChoiceDisplayMode =
        action.payload;
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
        state.selectedQuestion.Model3D.showQuestion = action.payload;
      }
    },

    toggleShowQuestion: (state, action: PayloadAction<boolean>) => {
      if (!state.selectedQuestion) return;

      state.selectedQuestion.showQuestion = action.payload;
    },

    updateSelectedQuestion3DModel: (state, action: PayloadAction<any>) => {
      if (!state.selectedQuestion) return;

      if (!state.selectedQuestion.Model3D) {
        state.selectedQuestion.Model3D = action.payload;
      } else {
        state.selectedQuestion.Model3D = {
          ...state.selectedQuestion.Model3D,
          ...action.payload,
        };
      }
    },

    updateQuestionField: <K extends keyof Element>(
      state: QuestionState,
      action: PayloadAction<{ key: K; value: Element[K] }>,
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
  setSelectedQuestionId,
  setTemplateImage,
  setBackgroundColor,
  set3DModelModalOpen,
  removeBackgroundColor,
  removeTemplateImage,
  setImageHeight,
  setImageWidth,
  setImageAltText,
  setConceptFitDisplayMode,
  setTimedChoiceDisplayMode,
  toggleElementRequired,
  toggleShowImage,
  toggleShowQuestion,
  toggleShowQuestionfor3dType,
  updateMinValue,
  updateMaxValue,
  updateUIButtonText,
  updateBinaryButtonTextYes,
  updateBinaryButtonTextNo,
  updateQuestionField,
  updateSelectedQuestion3DModel,
  resetQuestion,
} = questionSlice.actions;

export default questionSlice.reducer;
