import { apiSlice } from "../api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query() {
        return {
          url: "/u/me",
          credentials: "include",
        };
      },
      providesTags: ["User"],
    }),
    resendVerificationEmail: builder.mutation({
      query: (email) => ({
        url: "/u/verify",
        method: "POST",
        body: { email },
      }),
    }),
    addNewUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUserInfo: builder.mutation({
      query: ({ firstname, lastname, email }) => ({
        url: `/u/update`,
        method: "PATCH",
        body: { firstname, lastname, email },
      }),
      invalidatesTags: ["User"],
    }),
    updateUserTourStatus: builder.mutation({
      query: (updates) => ({
        url: "/u/tour",
        method: "PATCH",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useAddNewUserMutation,
  useResendVerificationEmailMutation,
  useUpdateUserInfoMutation,
  useUpdateUserTourStatusMutation,
} = usersApiSlice;
