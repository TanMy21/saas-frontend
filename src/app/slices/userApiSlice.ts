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
    getOrgUsers: builder.query<any, void>({
      query: () => ({
        url: "/u/org-users",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getOrgUserById: builder.query({
      query: (userID: string) => ({
        url: `/u/org-users/${userID}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getOrgInvites: builder.query<any, void>({
      query: () => ({
        url: "/u/org-invites",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    resendVerificationEmail: builder.mutation({
      query: (email) => ({
        url: "/u/verify",
        method: "POST",
        body: email,
      }),
    }),
    resendOrgInvite: builder.mutation({
      query: (inviteID: string) => ({
        url: `/u/org-invites/${inviteID}/resend`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    revokeOrgInvite: builder.mutation({
      query: (inviteID: string) => ({
        url: `/u/org-invites/${inviteID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    addNewUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    createNewUser: builder.mutation({
      query: (data) => ({
        url: "/u/create",
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
    updateOrgUser: builder.mutation({
      query: ({ userID, ...data }) => ({
        url: `/u/org-users/${userID}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteOrgUser: builder.mutation({
      query: (userID: string) => ({
        url: `/u/org-users/${userID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    validateOrganizationInvite: builder.query({
      query: (token) => `/u/invite/${token}`,
    }),
    acceptOrganizationInvite: builder.mutation({
      query: (body) => ({
        url: "/u/invite/accept",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetOrgUsersQuery,
  useGetOrgUserByIdQuery,
  useGetOrgInvitesQuery,
  useAddNewUserMutation,
  // useUpdateUserMutation,
  // useDeleteUserMutation,
  useValidateOrganizationInviteQuery,
  useAcceptOrganizationInviteMutation,
  useCreateNewUserMutation,
  useResendVerificationEmailMutation,
  useResendOrgInviteMutation,
  useRevokeOrgInviteMutation,
  useUpdateUserInfoMutation,
  useUpdateOrgUserMutation,
  useDeleteOrgUserMutation,
  useUpdateUserTourStatusMutation,
} = usersApiSlice;

// returns the query result object
// export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// // creates memoized selector
// const selectUsersData = createSelector(
//     selectUsersResult,
//     usersResult => usersResult.data // normalized state object with ids & entities
// )

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//     selectAll: selectAllUsers,
//     selectById: selectUserById,
//     selectIds: selectUserIds
//     // Pass in a selector that returns the users slice of state
// } = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
