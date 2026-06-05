import {
  GenerateDropdownOptionsRequest,
  GenerateDropdownOptionsResponse,
} from "../../types/genTypes";
import { apiSlice } from "../api/apiSlice";

export const genApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateDropdownOptions: builder.mutation<
      GenerateDropdownOptionsResponse,
      GenerateDropdownOptionsRequest
    >({
      query: (body) => ({
        url: "/o/generate-options",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Options", "Generate"],
    }),
  }),
});

export const { useGenerateDropdownOptionsMutation } = genApiSlice;
