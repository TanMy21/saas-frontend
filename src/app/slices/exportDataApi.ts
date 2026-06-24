import {
  ExportJobStartResponse,
  ExportJobStatusResponse,
} from "../../types/exportTypes";
import { apiSlice } from "../api/apiSlice";

export const exportDataApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    exportSurveyFull: builder.mutation<
      ExportJobStartResponse,
      { surveyID: string; format: "csv" | "xlsx" }
    >({
      query: (body) => ({
        url: "/export/full",
        method: "POST",
        body,
        cache: "no-cache",
      }),
    }),

    exportSelectedResponses: builder.mutation<
      ExportJobStartResponse,
      {
        surveyID: string;
        participantIDs: string[];
        format: "csv" | "xlsx";
      }
    >({
      query: (body) => ({
        url: "/export/select",
        method: "POST",
        body,
        cache: "no-cache",
      }),
    }),

    getExportJobStatus: builder.query<ExportJobStatusResponse, string>({
      query: (jobID) => ({
        url: `/export/job/${jobID}`,
        method: "GET",
        cache: "no-cache",
      }),
    }),
  }),
});

export const {
  useExportSurveyFullMutation,
  useExportSelectedResponsesMutation,
  useGetExportJobStatusQuery,
} = exportDataApi;
