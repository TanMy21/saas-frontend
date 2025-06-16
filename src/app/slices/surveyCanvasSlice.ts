import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SurveyCanvasState {
  data: any;
}

const initialState: SurveyCanvasState = {
  data: null,
};

const surveyCanvasSlice = createSlice({
  name: "surveyCanvas",
  initialState,
  reducers: {
    setSurveyCanvas: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    clearSurveyCanvas: (state) => {
      state.data = null;
    },
  },
});

export const { setSurveyCanvas, clearSurveyCanvas } = surveyCanvasSlice.actions;
export default surveyCanvasSlice.reducer;
