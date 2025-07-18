import { AuthResponse, ILogoutResponse } from "../../utils/types";
import { apiSlice } from "../api/apiSlice";

import { setCredentials, logOut } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    googleAuth: builder.query({
      query: () => ({
        url: "/auth/token",
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/password/forgot",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ password, code }) => ({
        url: "/password/reset",
        method: "POST",
        body: { password, code },
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ email, newPassword }) => ({
        url: "/update/pwd",
        method: "PATCH",
        body: { email, newPassword },
      }),
    }),
    verifyEmail: builder.query({
      query: (verificationCode) => ({
        url: `/verify/${verificationCode}`,
        method: "GET",
      }),
    }),
    sendLogout: builder.mutation<ILogoutResponse, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          // const { data } =
          await queryFulfilled;

          dispatch(logOut());

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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log("refresh query fullfilled", data);

          const { accessToken } = data;
          dispatch(
            setCredentials({
              // token: accessToken,
              accessToken,
              // isLoggedIn: true,
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
  // overrideExisting: false,
});

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useForgotPasswordMutation,
  useVerifyEmailQuery,
  useLazyGoogleAuthQuery,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
} = authApiSlice;
