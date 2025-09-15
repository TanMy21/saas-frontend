import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  overlayOpen: boolean;
  overlayMessage?: string;
}

const initialState: UIState = { overlayOpen: false };

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
  },
});

export const { showOverlay, hideOverlay } = overlaySlice.actions;
export default overlaySlice.reducer;
