import { apiSlice } from "../api/apiSlice";

export const insightsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInsights: builder.query({
      query: (surveyID) => `/ses/stats/${surveyID}`,
      providesTags: ["Insights"],
    }),
  }),
});

export const { useGetInsightsQuery } = insightsApiSlice;
