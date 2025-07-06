import { apiSlice } from "../api/apiSlice";

export const questionPreferencesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionPreferencesByID: builder.query({
      query: (questionID) => `/q/pref/${questionID}`,
      providesTags: ["QuestionPreferences"],
    }),
  }),
});

export const {
  useGetQuestionPreferencesByIDQuery,
  useLazyGetQuestionPreferencesByIDQuery,
} = questionPreferencesApiSlice;
