import { apiSlice } from "../api/apiSlice";

export const flowApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCondition: builder.mutation({
      query: (data) => ({
        url: "/q/condition/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Flow", "Elements", "Surveys", "Options"],
    }),
    getConditionsForQuestion: builder.query({
      query: (questionID) => `/q/conditions/${questionID}`,
      providesTags: ["Flow", "Elements", "Options"],
    }),
    getAllConditionsForSurvey: builder.query({
      query: (surveyID) => {
        return `/s/all/conditions/${surveyID}`;
      },
      providesTags: ["Flow", "Elements", "Options"],
    }),
    deleteCondition: builder.mutation({
      query: (flowConditionID) => ({
        url: `/q/condition/delete/${flowConditionID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Flow", "Elements", "Surveys", "Options"],
    }),
  }),
});

export const {
  useCreateConditionMutation,
  useGetConditionsForQuestionQuery,
  useGetAllConditionsForSurveyQuery,
  useDeleteConditionMutation,
} = flowApiSlice;
