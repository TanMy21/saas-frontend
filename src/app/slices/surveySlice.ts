import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { Element } from "../../utils/types";

interface SurveyBuilderState {
  elements: Element[];
}

const initialState: SurveyBuilderState = {
  elements: [],
};

export const surveyBuilderSlice = createSlice({
  name: "surveyBuilder",
  initialState,
  reducers: {
    setElements: (state, action: PayloadAction<Element[]>) => {
      state.elements = action.payload;
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
  },
});

export const {
  setElements,
  addElement,
  deleteElementRedux,
  updateElementOrder,
} = surveyBuilderSlice.actions;

export default surveyBuilderSlice.reducer;
