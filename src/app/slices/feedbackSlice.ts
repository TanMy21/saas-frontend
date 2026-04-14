import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFeedbackModalOpen: false,
};

const feedbackUISlice = createSlice({
  name: "feedbackUI",
  initialState,
  reducers: {
    openFeedbackModal: (state) => {
      state.isFeedbackModalOpen = true;
    },
    closeFeedbackModal: (state) => {
      state.isFeedbackModalOpen = false;
    },
  },
});

export const { openFeedbackModal, closeFeedbackModal } =
  feedbackUISlice.actions;

export default feedbackUISlice.reducer;
