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
    addNewUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMeQuery,
  useAddNewUserMutation,
  // useUpdateUserMutation,
  // useDeleteUserMutation,
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
