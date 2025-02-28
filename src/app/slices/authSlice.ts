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
      localStorage.removeItem("persist");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
