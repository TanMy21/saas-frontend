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
    createNewWorkspace: builder.mutation({
      query: (data) => ({
        url: "/w/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workspaces"],
    }),
    updateWorkspaceName: builder.mutation({
      query: ({ workspaceId, name }) => ({
        url: `/w/${workspaceId}/name`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["Workspaces"],
    }),
    deleteWorkspace: builder.mutation({
      query: (workspaceId) => ({
        url: `/w/${workspaceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspaces"],
    }),
  }),
});

export const {
  useGetWorkspacesQuery,
  useGetWorkspaceSurveysQuery,
  useCreateNewWorkspaceMutation,
  useUpdateWorkspaceNameMutation,
  useDeleteWorkspaceMutation,
} = workspaceApiSlice;
