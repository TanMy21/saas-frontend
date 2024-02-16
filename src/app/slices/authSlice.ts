import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState {
  token: string | null;
  accessToken: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  token: null,
  accessToken: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }: PayloadAction<AuthState>) => {
      const { accessToken } = payload;
      state.token = accessToken;
      state.isLoggedIn = true;
      
      // state.token = JSON.stringify(action.payload);
    },
    logOut: (state) => {
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectLoggedInState = (state: RootState) => state.auth.isLoggedIn;
