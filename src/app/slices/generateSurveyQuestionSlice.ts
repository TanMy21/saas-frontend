import { createSlice } from "@reduxjs/toolkit";

interface generateQuestionUIState {
  aiQuestionsJustAdded: boolean;
}

const initialState: generateQuestionUIState = {
  aiQuestionsJustAdded: false,
};

const generateQuestionUISlice = createSlice({
  name: "generateQuestionUI",
  initialState,
  reducers: {
    setAiQuestionsJustAdded: (state) => {
      state.aiQuestionsJustAdded = true;
    },

    clearAiQuestionsJustAdded: (state) => {
      state.aiQuestionsJustAdded = false;
    },
  },
});

export const { setAiQuestionsJustAdded, clearAiQuestionsJustAdded } =
  generateQuestionUISlice.actions;

export default generateQuestionUISlice.reducer;
