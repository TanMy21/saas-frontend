import { apiSlice } from "../api/apiSlice";

export const workspaceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaces: builder.query({
      query: () => "/w/workspaces",
      providesTags: ["Workspaces"],
    }),
    getWorkspaceSurveys: builder.query({
      query: (workspaceId) => `/w/${workspaceId}/surveys`,
      providesTags: ["Workspaces", "Surveys"],
    }),
  }),
});

export const { useGetWorkspacesQuery, useGetWorkspaceSurveysQuery } =
  workspaceApiSlice;
