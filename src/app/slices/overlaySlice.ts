import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { UIState } from "../../utils/types";

const initialState: UIState = {
  overlayOpen: false,
  overlayMessage: "",
  publishAlertOpen: false,
  shareModalOpen: false,
};

const overlaySlice = createSlice({
  name: "overlayUI",
  initialState,
  reducers: {
    showOverlay: (s, a: PayloadAction<string | undefined>) => {
      s.overlayOpen = true;
      s.overlayMessage = a.payload;
    },
    hideOverlay: (s) => {
      s.overlayOpen = false;
      s.overlayMessage = undefined;
    },
    openPublishAlert: (s) => {
      s.publishAlertOpen = true;
    },
    closePublishAlert: (s) => {
      s.publishAlertOpen = false;
    },

    openShareModal: (s) => {
      s.shareModalOpen = true;
    },
    closeShareModal: (s) => {
      s.shareModalOpen = false;
    },
  },
});

export const {
  showOverlay,
  hideOverlay,
  openPublishAlert,
  closePublishAlert,
  openShareModal,
  closeShareModal,
} = overlaySlice.actions;

export default overlaySlice.reducer;
