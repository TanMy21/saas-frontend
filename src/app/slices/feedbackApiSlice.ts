import { apiSlice } from "../api/apiSlice";

export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFeedback: builder.mutation({
      query: (body) => ({
        url: "/feedback",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateFeedbackMutation } = feedbackApi;
