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
    importQuestions: builder.mutation({
      query: ({ surveyID, value }) => ({
        url: "/q/generate",
        method: "POST",
        body: { surveyID, value },
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
      async onQueryStarted(
        { questionID, description },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          elementApiSlice.util.updateQueryData(
            "getElementByID",
            questionID,
            (draft) => {
              const element = draft.find(
                (e: Element) => e.questionID === questionID
              );
              if (element) {
                element.description = description;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Elements"],
    }),
    updateElementSettings: builder.mutation({
      query: ({
        questionID,
        titleFontSize,
        titleFontColor,
        descriptionFontColor,
        descriptionFontSize,
      }) => ({
        url: `/q/settings`,
        method: "PATCH",
        body: {
          questionID,
          titleFontSize,
          titleFontColor,
          descriptionFontColor,
          descriptionFontSize,
        },
      }),
      invalidatesTags: ["Elements"],
    }),
    updateScreenElements: builder.mutation({
      query: ({ questionID, text, description, settings }) => ({
        url: `/q/screen/elements`,
        method: "PATCH",
        body: { questionID, text, description, settings },
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
  useUpdateElementSettingsMutation,
  useUpdateScreenElementsMutation,
  useUpdateElementDescriptionMutation,
  useDuplicateElementMutation,
  useDeleteElementMutation,
  useImportQuestionsMutation,
} = elementApiSlice;
