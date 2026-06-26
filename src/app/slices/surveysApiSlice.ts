import { apiSlice } from "../api/apiSlice";

export const surveysApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSurveys: builder.query({
      query: () => "/s/surveys",
      providesTags: ["Surveys"],
    }),
    getSurveyById: builder.query({
      query: (surveyID) => `/s/survey/${surveyID}`,
      providesTags: ["Surveys"],
    }),
    getSurveySettings: builder.query({
      query: (surveyID) => `/s/settings/${surveyID}`,
      providesTags: ["Surveys"],
    }),
    getSurveyCanvasById: builder.query({
      query: (surveyID) => `/s/survey/canvas/${surveyID}`,
      providesTags: ["Surveys"],
    }),
    createSurvey: builder.mutation({
      query: (data) => ({
        url: `/s/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Surveys", "Workspaces"],
    }),
    generateSurvey: builder.mutation<
      {
        message: string;
        jobID: string;
        surveyID: string;
        status:
          | "PENDING"
          | "PROCESSING"
          | "COMPLETED"
          | "FAILED"
          | "CANCELED"
          | "TIMED_OUT";
      },
      {
        surveyID: string;
        inputText?: string;
        numberOfQuestions?: number;
        questionTypes: string[];
        mode?: "INITIAL" | "APPEND" | "REPLACE";
      }
    >({
      query: ({
        surveyID,
        inputText,
        numberOfQuestions,
        questionTypes,
        mode,
      }) => ({
        url: `/s/generate`,
        method: "POST",
        body: {
          surveyID,
          inputText,
          numberOfQuestions,
          questionTypes,
          ...(mode ? { mode } : {}),
        },
      }),
    }),
    getAIGenerationJobStatus: builder.query<
      {
        jobID: string;
        surveyID: string;
        status:
          | "PENDING"
          | "PROCESSING"
          | "COMPLETED"
          | "FAILED"
          | "CANCELED"
          | "TIMED_OUT";
        generatedCount?: number | null;
        errorMessage?: string | null;
      },
      string
    >({
      query: (jobID) => `/s/generate/job/${jobID}`,
      providesTags: ["Surveys", "Elements"],
    }),
    updateSurveyTitleandDescription: builder.mutation({
      query: ({ surveyID, title, description }) => ({
        url: `/s/utd/${surveyID}`,
        method: "PATCH",
        body: { title, description },
      }),
      invalidatesTags: ["Surveys"],
    }),
    updateSurveyTags: builder.mutation({
      query: ({ surveyID, tags }) => ({
        url: `/s/tags`,
        method: "PATCH",
        body: { surveyID, tags },
      }),
      invalidatesTags: ["Surveys"],
    }),
    updateSurveyArchive: builder.mutation({
      query: ({ surveyID, archive }) => ({
        url: `/s/archive`,
        method: "PATCH",
        body: { surveyID, archive },
      }),
      invalidatesTags: ["Surveys", "Workspaces"],
    }),
    updateSurvey: builder.mutation({
      query: ({
        title,
        description,
        surveyID,
        startDate,
        endDate,
        language,
        published,
      }) => ({
        url: `/s/settings/${surveyID}`,
        method: "PUT",
        body: {
          title,
          description,
          surveyID,
          startDate,
          endDate,
          language,
          published,
        },
      }),
      invalidatesTags: ["Surveys"],
    }),
    retitleSurvey: builder.mutation({
      query: ({ surveyID, title }) => ({
        url: `/s/title/${surveyID}`,
        method: "PATCH",
        body: { title },
      }),
      invalidatesTags: ["Surveys"],
    }),
    duplicateSurvey: builder.mutation({
      query: (surveyID) => ({
        url: `/s/duplicate/${surveyID}`,
        method: "POST",
      }),
      invalidatesTags: ["Surveys"],
    }),
    publishSurvey: builder.mutation({
      query: (data) => ({
        url: `/s/publish`,
        method: "PATCH",
        body: data,
      }),
    }),
    copySurvey: builder.mutation({
      query: ({ surveyID, workspaceId }) => ({
        url: `/s/${surveyID}/copy/${workspaceId}`,
        method: "POST",
      }),
      invalidatesTags: ["Surveys"],
    }),
    moveSurvey: builder.mutation({
      query: ({ surveyID, workspaceId }) => ({
        url: `/s/${surveyID}/move/${workspaceId}`,
        method: "POST",
      }),
      invalidatesTags: ["Surveys"],
    }),
    deleteSurvey: builder.mutation({
      query: (surveyID) => ({
        url: `/s/delete/${surveyID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Surveys"],
    }),
    trackShareEvent: builder.mutation<
      { success: boolean },
      {
        surveyID: string;
        actionType: string;
        events?: { actionType: string }[];
      }
    >({
      query: (body) => ({
        url: "/s/share-event",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetSurveysQuery,
  useGetSurveySettingsQuery,
  useGetSurveyByIdQuery,
  useGetSurveyCanvasByIdQuery,
  useCreateSurveyMutation,
  useGenerateSurveyMutation,
  useGetAIGenerationJobStatusQuery,
  useUpdateSurveyTitleandDescriptionMutation,
  useUpdateSurveyTagsMutation,
  useUpdateSurveyArchiveMutation,
  useUpdateSurveyMutation,
  useRetitleSurveyMutation,
  useDuplicateSurveyMutation,
  useCopySurveyMutation,
  useMoveSurveyMutation,
  useDeleteSurveyMutation,
  usePublishSurveyMutation,
  useTrackShareEventMutation,
} = surveysApiSlice;

export const {
  endpoints: { getSurveyCanvasById },
} = surveysApiSlice;
