import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import { apiSlice } from "./api/apiSlice";
import authReducer from "./slices/authSlice";
import questionReducer from "./slices/elementSlice";
import elementTypographyReducer from "./slices/elementTypographySlice";
import overlaySlice from "./slices/overlaySlice";
import surveyCanvasReducer from "./slices/surveyCanvasSlice";
import surveyBuilderReducer from "./slices/surveySlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    elementTypography: elementTypographyReducer,
    question: questionReducer,
    surveyBuilder: surveyBuilderReducer,
    surveyCanvas: surveyCanvasReducer,
    overlayUI: overlaySlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.VITE_REACT_APP_NODE_ENV === "development",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
