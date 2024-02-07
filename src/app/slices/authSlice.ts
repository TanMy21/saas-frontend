import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: (Cookies.get("jwt") as string) || null },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      Cookies.set("jwt", accessToken);
      state.token = accessToken;
    },
    logOut: (state) => {
      state.token = null;
      Cookies.remove("jwt");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
