import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SurveyCanvasState {
  data: any;
  hasResponses: boolean;
  isEditLocked: boolean;
}

const initialState: SurveyCanvasState = {
  data: null,
  hasResponses: false,
  isEditLocked: false,
};

const surveyCanvasSlice = createSlice({
  name: "surveyCanvas",
  initialState,
  reducers: {
    setSurveyCanvas: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
      state.hasResponses = Boolean(action.payload?.hasResponses);
      state.isEditLocked = Boolean(action.payload?.isEditLocked);
    },
    clearSurveyCanvas: (state) => {
      state.data = null;
      state.hasResponses = false;
      state.isEditLocked = false;
    },
  },
});

export const { setSurveyCanvas, clearSurveyCanvas } = surveyCanvasSlice.actions;
export default surveyCanvasSlice.reducer;
