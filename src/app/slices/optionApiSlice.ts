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
    deleteOption: builder.mutation({
      query: (optionID) => ({
        url: `/op/delete/${optionID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Options"],
    }),
  }),
});

export const {
  useGetOptionsOfQuestionQuery,
  useCreateNewOptionMutation,
  useUpdateOptionTextandValueMutation,
  useDeleteOptionMutation,
} = optionApiSlice;
