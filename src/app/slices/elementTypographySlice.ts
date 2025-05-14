import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { TypographySettingsForm } from "../../utils/types";

const defaultState: TypographySettingsForm = {
  titleFontSize: 16,
  titleFontColor: "#000000",
  descriptionFontSize: 12,
  descriptionFontColor: "#000000",
};

const elementTypographySlice = createSlice({
  name: "elementTypography",
  initialState: defaultState,
  reducers: {
    initializeTypography: (
      state,
      action: PayloadAction<Partial<TypographySettingsForm>>
    ) => {
      return { ...defaultState, ...action.payload };
    },
    updateTypographyField: (
      state,
      action: PayloadAction<{
        key: keyof TypographySettingsForm;
        value: string | number;
      }>
    ) => {
      state[action.payload.key] = action.payload.value as never;
    },
    resetTypography: () => defaultState,
  },
});

export const { initializeTypography, updateTypographyField, resetTypography } =
  elementTypographySlice.actions;

export default elementTypographySlice.reducer;
