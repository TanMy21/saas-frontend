import { apiSlice } from "../api/apiSlice";

export const flowApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCondition: builder.mutation({
      query: (data) => ({
        url: "/q/condition/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Flow"],
    }),
    getConditionsForQuestion: builder.query({
      query: (questionID) => `/q/conditions/${questionID}`,
      providesTags: ["Flow"],
    }),
  }),
});

export const { useCreateConditionMutation, useGetConditionsForQuestionQuery } =
  flowApiSlice;
