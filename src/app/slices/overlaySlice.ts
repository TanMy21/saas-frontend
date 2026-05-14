import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { UIState } from "../../utils/types";

const initialState: UIState = {
  overlayOpen: false,
  overlayMessage: undefined,
  publishAlertOpen: false,
  shareModalOpen: false,
  overlayVariant: undefined,
};

const overlaySlice = createSlice({
  name: "overlayUI",
  initialState,
  reducers: {
    showOverlay: (
      s,
      a: PayloadAction<{
        message?: string;
        variant?: "IMPORT" | "GENERATE" | "FEEDBACK" | "SIMPLE";
      }>,
    ) => {
      s.overlayOpen = true;
      s.overlayMessage = a.payload.message;
      s.overlayVariant = a.payload.variant || "IMPORT";
    },

    hideOverlay: (s) => {
      s.overlayOpen = false;
      s.overlayMessage = undefined;
      s.overlayVariant = undefined;
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
