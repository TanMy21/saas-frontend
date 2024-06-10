import { Element } from "../../utils/types";
import { apiSlice } from "../api/apiSlice";

export const elementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getElementsForSurvey: builder.query<Element[], string>({
      query: (surveyID) => `/q/all/${surveyID}`,
      providesTags: ["Elements"],
    }),
    getElementByID: builder.query({
      query: (questionID) => `/q/${questionID}`,
      providesTags: ["Elements"],
    }),
    createElement: builder.mutation({
      query: (data) => ({
        url: "/q/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Elements"],
    }),
    createScreenElement: builder.mutation({
      query: (data) => ({
        url: "/q/screen/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Elements"],
    }),
    updateElementText: builder.mutation({
      query: ({ questionID, text }) => ({
        url: `/q/${questionID}`,
        method: "PATCH",
        body: { text },
      }),
      invalidatesTags: ["Elements"],
    }),
    updateElementOrder: builder.mutation({
      query: ({ questions }) => ({
        url: `/q/order`,
        method: "PUT",
        body: { questions },
      }),
      invalidatesTags: ["Elements"],
    }),
    updateElementDescription: builder.mutation({
      query: ({ questionID, description }) => ({
        url: `/q/desc/${questionID}`,
        method: "PATCH",
        body: { description },
      }),
      invalidatesTags: ["Elements"],
    }),

    duplicateElement: builder.mutation({
      query: (questionID) => ({
        url: `/q/duplicate/${questionID}`,
        method: "POST",
      }),
      invalidatesTags: ["Elements"],
    }),
    deleteElement: builder.mutation({
      query: (questionID) => ({
        url: `/q/delete/${questionID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Elements"],
    }),
  }),
});

export const {
  useGetElementsForSurveyQuery,
  useGetElementByIDQuery,
  useCreateElementMutation,
  useCreateScreenElementMutation,
  useUpdateElementTextMutation,
  useUpdateElementOrderMutation,
  useUpdateElementDescriptionMutation,
  useDuplicateElementMutation,
  useDeleteElementMutation,
} = elementApiSlice;
