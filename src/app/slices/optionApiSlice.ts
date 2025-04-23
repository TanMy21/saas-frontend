import { OptionType } from "../../utils/types";
import { apiSlice } from "../api/apiSlice";

export const optionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOptionsOfQuestion: builder.query<OptionType[], string>({
      query: (questionID) => `/op/all/${questionID}`,
      providesTags: ["Options"],
    }),
    createNewOption: builder.mutation({
      query: (data) => ({
        url: `/op/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Options"],
    }),
    updateOptionTextandValue: builder.mutation({
      query: ({ optionID, text, value }) => ({
        url: `/op/${optionID}`,
        method: "PATCH",
        body: { text, value },
      }),
      invalidatesTags: ["Options"],
    }),
    updateOptionOrder: builder.mutation({
      query: ({ options }) => ({
        url: `/op/order`,
        method: "PUT",
        body: { options },
      }),
    }),
    uploadImage: builder.mutation({
      query: ({ formData, optionID }) => ({
        url: `/op/img/${optionID}`,
        method: "PATCH",
        body: formData,
        // headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["Options"],
    }),
    deleteOption: builder.mutation({
      query: (optionID) => ({
        url: `/op/delete/${optionID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Options"],
    }),
    removeImage: builder.mutation({
      query: (optionID) => ({
        url: `/op/remove/img/${optionID}`,
        method: "POST",
      }),
      invalidatesTags: ["Options"],
    }),
  }),
});

export const {
  useGetOptionsOfQuestionQuery,
  useCreateNewOptionMutation,
  useUpdateOptionTextandValueMutation,
  useUpdateOptionOrderMutation,
  useUploadImageMutation,
  useDeleteOptionMutation,
  useRemoveImageMutation,
} = optionApiSlice;
