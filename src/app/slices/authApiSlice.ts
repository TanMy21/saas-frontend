import { apiSlice } from "../api/apiSlice";
import { setCredentials, logOut } from "./authSlice";

interface AuthResponse {
  accessToken: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: { ...credentials },
      }), 
    }),
    sendLogout: builder.mutation<any, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.log("Auth Api Slice: ", dispatch);
          const { data } = await queryFulfilled;
          console.log("Auth Api Slice: ", data);
          dispatch(logOut());
          // dispatch(apiSlice.util.resetApiState());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/refresh",
        method: "GET",
      }),
    }),
    async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      try {
        const { data } = await queryFulfilled;
        console.log(data);
        const { accessToken } = data;
        dispatch(setCredentials({ accessToken }));
      } catch (err) {
        console.log(err);
      }
    },
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
