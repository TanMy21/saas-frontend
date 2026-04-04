import { apiSlice } from "../api/apiSlice";

export const orgApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPendingInvites: builder.query<any[], void>({
      query: () => ({
        url: "/invites/pending",
        method: "GET",
      }),
      providesTags: ["Organization"],
    }),

    acceptInvite: builder.mutation<void, { inviteID: string }>({
      query: ({ inviteID }) => ({
        url: "/invites/accept",
        method: "POST",
        body: { inviteID },
      }),
      invalidatesTags: ["Organization"],
    }),

    declineInvite: builder.mutation<void, { inviteID: string }>({
      query: ({ inviteID }) => ({
        url: "/invites/decline",
        method: "POST",
        body: { inviteID },
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
});

export const {
  useGetPendingInvitesQuery,
  useAcceptInviteMutation,
  useDeclineInviteMutation,
} = orgApiSlice;
