import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  CanvasView,
  CanvasViewState,
} from "../../types/surveyBuilderTypes";

interface SurveyCanvasState extends CanvasViewState {
  data: any;
  hasResponses: boolean;
  isEditLocked: boolean;
}

const initialState: SurveyCanvasState = {
  data: null,
  hasResponses: false,
  isEditLocked: false,
  view: "desktop",
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
    setCanvasView: (state, action: PayloadAction<CanvasView>) => {
      state.view = action.payload;
    },
  },
});

export const { setSurveyCanvas, clearSurveyCanvas, setCanvasView } =
  surveyCanvasSlice.actions;
export default surveyCanvasSlice.reducer;
