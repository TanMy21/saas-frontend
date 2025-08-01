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
      invalidatesTags: ["Surveys"],
    }),
    generateSurvey: builder.mutation({
      query: ({ surveyID, inputText, numberOfQuestions, questionTypes }) => ({
        url: `/s/generate`,
        method: "POST",
        body: { surveyID, inputText, numberOfQuestions, questionTypes },
      }),
      invalidatesTags: ["Surveys"],
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
    updateSurvey: builder.mutation({
      query: ({ surveyID, startDate, endDate, language }) => ({
        url: `/s/settings/${surveyID}`,
        method: "PUT",
        body: {
          surveyID,
          startDate,
          endDate,
          language,
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
  }),
});

export const {
  useGetSurveysQuery,
  useGetSurveySettingsQuery,
  useGetSurveyByIdQuery,
  useGetSurveyCanvasByIdQuery,
  useCreateSurveyMutation,
  useGenerateSurveyMutation,
  useUpdateSurveyTitleandDescriptionMutation,
  useUpdateSurveyTagsMutation,
  useUpdateSurveyMutation,
  useRetitleSurveyMutation,
  useDuplicateSurveyMutation,
  useCopySurveyMutation,
  useMoveSurveyMutation,
  useDeleteSurveyMutation,
  usePublishSurveyMutation,
} = surveysApiSlice;

export const {
  endpoints: { getSurveyCanvasById },
} = surveysApiSlice;
