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
  sessionExpired: false,
  // isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }: PayloadAction<AuthState>) => {
      const { accessToken } = payload;

      console.log("Setting credentials in authSlice", accessToken);
      state.token = accessToken;
      console.log("Token state", state.token);
      state._id = payload._id;
      state.email = payload.email;
      state.isAdmin = payload.isAdmin;
      // state.isLoggedIn = true;
      localStorage.setItem("persist", "true");
    },
    logOut: (state) => {
      state.token = null;
      // state.isLoggedIn = false;
      localStorage.removeItem("persist");
    },

    setSessionExpired: (state, action: PayloadAction<boolean>) => {
      state.sessionExpired = action.payload;
      if (action.payload) {
        state.token = null;
        state._id = null;
        state.email = null;
        state.isAdmin = false;
        localStorage.removeItem("persist");
      }
    },
  },
});

export const { setCredentials, logOut, setSessionExpired } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
// export const selectLoggedInState = (state: RootState) => state.auth.isLoggedIn;
