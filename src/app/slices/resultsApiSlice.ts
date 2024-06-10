import { ResultsResponse } from "../../utils/types";
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
  }),
});

export const { useGetResultsQuery } = resultsApiSlice;
