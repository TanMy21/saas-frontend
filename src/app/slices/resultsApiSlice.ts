import {
  GetInsightsArgs,
  GetResponsesSummaryArgs,
  ResponsesSummaryResponse,
} from "../../utils/insightTypes";
import { InsightsResponse, ResultsResponse } from "../../utils/types";
import { apiSlice } from "../api/apiSlice";

import { normalizeResponsesSummary } from "./normalizeResponseSummary";

export const resultsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getResults: builder.query<ResultsResponse, string>({
      query: (surveyID) => `/results/${surveyID}`,
      transformResponse: (response: ResultsResponse) => {
        const filteredResponse = response.questions.filter(
          (question) =>
            !["WELCOME_SCREEN", "END_SCREEN", "INSTRUCTIONS"].includes(
              question.type,
            ),
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
    getResponsesSummary: builder.query<
      ResponsesSummaryResponse,
      GetResponsesSummaryArgs
    >({
      query: ({
        surveyID,
        deviceType = "all",
        range = "all",
        from,
        to,
        q,
        page = 1,
        pageSize = 25,
      }) => ({
        url: `/summary/${surveyID}`,
        params: {
          deviceType,
          range,
          from,
          to,
          q,
          page,
          pageSize,
        },
      }),

      transformResponse: (response: {
        success: boolean;
        data: ResponsesSummaryResponse;
      }) => ({
        ...response.data,
        questions: normalizeResponsesSummary(response.data),
      }),

      providesTags: (_result, _err, arg) => [
        { type: "Results", id: arg.surveyID },
      ],
    }),
  }),
});

export const {
  useGetResultsQuery,
  useGetInsightsQuery,
  useGetResponsesSummaryQuery,
} = resultsApiSlice;
