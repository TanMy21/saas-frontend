import {
  AuditFilters,
  AuditLog,
  PaginatedResponse,
  SessionFilters,
  UserSession,
} from "../../types/accountSettingsTypes";
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
    getOrganizationUserSessions: builder.query<
      PaginatedResponse<UserSession>,
      { orgID: string; filters: SessionFilters }
    >({
      query: ({ orgID, filters }) => ({
        url: `/organizations/${encodeURIComponent(orgID)}/security/user-sessions`,
        method: "GET",
        params: filters,
      }),
    }),

    getOrganizationAuditLogs: builder.query<
      PaginatedResponse<AuditLog>,
      { orgID: string; filters: AuditFilters }
    >({
      query: ({ orgID, filters }) => ({
        url: `/organizations/${encodeURIComponent(orgID)}/audit-logs`,
        method: "GET",
        params: filters,
      }),
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
  useGetOrganizationUserSessionsQuery,
  useGetOrganizationAuditLogsQuery,
  useAcceptInviteMutation,
  useDeclineInviteMutation,
} = orgApiSlice;
