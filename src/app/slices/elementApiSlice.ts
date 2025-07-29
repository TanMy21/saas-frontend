import { Element } from "../../utils/types";
import { apiSlice } from "../api/apiSlice";

export const elementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getElementsForSurvey: builder.query<Element[], string>({
      query: (surveyID) => `/q/all/${surveyID}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Elements", id: "LIST" },
              ...result.map(({ questionID }) => ({
                type: "Elements" as const,
                id: questionID,
              })),
            ]
          : [{ type: "Elements", id: "LIST" }],
    }),
    getElementByID: builder.query({
      query: (questionID) => `/q/${questionID}`,
      providesTags: (result, error, questionID) => [
        { type: "Elements", id: questionID },
      ],
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
    updateElementTypography: builder.mutation({
      query: ({
        questionID,
        titleFontSize,
        titleTextColor,
        descriptionTextColor,
        descriptionFontSize,
      }) => ({
        url: `/q/settings`,
        method: "PATCH",
        body: {
          questionID,
          titleFontSize,
          titleTextColor,
          descriptionTextColor,
          descriptionFontSize,
        },
      }),
      invalidatesTags: ["Elements"],
    }),
    updateElementTypographyMobileView: builder.mutation({
      query: ({
        questionID,
        titleFontSizeMobile,
        descriptionFontSizeMobile,
      }) => ({
        url: `/q/mobile/settings`,
        method: "PATCH",
        body: {
          questionID,
          titleFontSizeMobile,
          descriptionFontSizeMobile,
        },
      }),
      invalidatesTags: ["Elements"],
    }),
    updateScreenElements: builder.mutation({
      query: ({ questionID, text, description }) => ({
        url: `/q/screen/elements`,
        method: "PATCH",
        body: { questionID, text, description },
      }),
      invalidatesTags: ["Elements"],
    }),
    updateQuestionRequiredPreference: builder.mutation({
      query: ({ questionID, required }) => ({
        url: `/q/pref/required`,
        method: "PATCH",
        body: { questionID, required },
      }),
      invalidatesTags: ["Elements"],
    }),
    updateQuestionPreferenceUIConfig: builder.mutation({
      query: ({ questionID, uiConfig }) => ({
        url: `/q/pref/config`,
        method: "PATCH",
        body: { questionID, uiConfig },
      }),
      invalidatesTags: ["Elements"],
    }),
    updateQuestionImageDimensions: builder.mutation({
      query: ({ questionID, questionImageWidth, questionImageHeight }) => ({
        url: `/q/img/dimensions`,
        method: "PATCH",
        body: { questionID, questionImageWidth, questionImageHeight },
      }),
      invalidatesTags: ["Elements"],
    }),
    updateQuestionImageAltTxt: builder.mutation({
      query: ({ questionID, questionImageAltTxt }) => ({
        url: `/q/img/alt`,
        method: "PATCH",
        body: { questionID, questionImageAltTxt },
      }),
      invalidatesTags: ["Elements"],
    }),
    updateQuestionBackgroundColor: builder.mutation({
      query: ({ questionID, questionBackgroundColor }) => ({
        url: `/q/bg/color`,
        method: "PATCH",
        body: { questionID, questionBackgroundColor },
      }),
      invalidatesTags: (result, error, { questionID }) => [
        { type: "Elements", id: questionID },
        { type: "Elements", id: "LIST" },
      ],
    }),
    uploadQuestionImage: builder.mutation({
      query: ({ formData, questionID }) => ({
        url: `/q/img/${questionID}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Elements"],
    }),
    uploadQuestionTemplateImage: builder.mutation({
      query: ({ formData, questionID }) => ({
        url: `/q/template/${questionID}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { questionID }) => [
        { type: "Elements", id: questionID },
        { type: "Elements", id: "LIST" },
      ],
    }),
    toggleQuestionImageVisibility: builder.mutation({
      query: ({ questionID, questionImage }) => ({
        url: `/q/img/visibility`,
        method: "PATCH",
        body: { questionID, questionImage },
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
    removeQuestionImage: builder.mutation({
      query: (questionID) => ({
        url: `/q/remove/img/${questionID}`,
        method: "POST",
      }),
      invalidatesTags: ["Elements"],
    }),
    removeQuestionTemplateImage: builder.mutation({
      query: (questionID) => ({
        url: `/q/remove/template/${questionID}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, questionID) => [
        { type: "Elements", id: questionID },
        { type: "Elements", id: "LIST" },
      ],
    }),
    removeQuestionBackgroundColor: builder.mutation({
      query: (questionID) => ({
        url: `/q/remove/bg/color`,
        method: "POST",
        body: { questionID },
      }),
      invalidatesTags: (result, error, questionID) => [
        { type: "Elements", id: questionID },
        { type: "Elements", id: "LIST" },
      ],
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
  useUpdateElementTypographyMutation,
  useUpdateElementTypographyMobileViewMutation,
  useUpdateQuestionRequiredPreferenceMutation,
  useUpdateQuestionPreferenceUIConfigMutation,
  useUpdateQuestionImageDimensionsMutation,
  useUpdateQuestionImageAltTxtMutation,
  useUpdateQuestionBackgroundColorMutation,
  useUpdateScreenElementsMutation,
  useUpdateElementDescriptionMutation,
  useUploadQuestionImageMutation,
  useUploadQuestionTemplateImageMutation,
  useRemoveQuestionImageMutation,
  useRemoveQuestionTemplateImageMutation,
  useRemoveQuestionBackgroundColorMutation,
  useDuplicateElementMutation,
  useDeleteElementMutation,
  useImportQuestionsMutation,
  useToggleQuestionImageVisibilityMutation,
} = elementApiSlice;
