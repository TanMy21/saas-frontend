import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { AuthState } from "../../utils/types";
import { RootState } from "../store";

const initialState: AuthState = {
  token: null,
  _id: null,
  email: null,
  isAdmin: false,
  accessToken: null,
  restoringSession: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }: PayloadAction<AuthState>) => {
      const { accessToken } = payload;
      state.token = accessToken;
      state._id = payload._id;
      state.email = payload.email;
      state.isAdmin = payload.isAdmin;
      localStorage.setItem("persist", "true");
    },
    logOut: (state) => {
      state.token = null;
      state._id = null;
      state.email = null;
      state.isAdmin = false;
      state.accessToken = null;
      localStorage.removeItem("persist");
    },
    setRestoringSession: (state, { payload }: PayloadAction<boolean>) => {
      state.restoringSession = payload;
    },
  },
});

export const { setCredentials, logOut, setRestoringSession } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
