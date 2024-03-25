import { apiSlice } from "../api/apiSlice";

export const surveysApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSurveys: builder.query({
      query: () => "/s/surveys",
      providesTags: ["Surveys"],
    }),
  }),
});

export const { useGetSurveysQuery } = surveysApiSlice;

