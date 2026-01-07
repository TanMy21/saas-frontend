import { GetInsightsArgs } from "../../utils/insightTypes";
import { InsightsResponse, ResultsResponse } from "../../utils/types";
import { apiSlice } from "../api/apiSlice";

export const resultsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getResults: builder.query<ResultsResponse, string>({
      query: (surveyID) => `/results/${surveyID}`,
      transformResponse: (response: ResultsResponse) => {
        const filteredResponse = response.questions.filter(
          (question) =>
            !["WELCOME_SCREEN", "END_SCREEN", "INSTRUCTIONS"].includes(
              question.type
            )
        );

        return { ...response, questions: filteredResponse };
      },
      providesTags: ["Results"],
    }),
    getInsights: builder.query<InsightsResponse, GetInsightsArgs>({
      query: ({ surveyID, time, device }) => ({
        url: `/insights/${surveyID}`,
        params: {
          time,
          device,
        },
      }),

      transformResponse: (response: {
        success: boolean;
        data: InsightsResponse;
      }) => response.data,

      providesTags: ["Results"],
    }),
  }),
});

export const { useGetResultsQuery, useGetInsightsQuery } = resultsApiSlice;
