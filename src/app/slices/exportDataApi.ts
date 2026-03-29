import { apiSlice } from "../api/apiSlice";

export const exportDataApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    exportSurveyFull: builder.mutation<
      void,
      { surveyID: string; format: "csv" | "xlsx" }
    >({
      query: (body) => ({
        url: "/export/full",
        method: "POST",
        body,
        cache: "no-cache",

        responseHandler: async (response) => {
          const blob = await response.blob();

          const disposition = response.headers.get("Content-Disposition");

          let fileName =
            body.format === "csv" ? "download.zip" : "download.xlsx";

          if (disposition) {
            const match = disposition.match(/filename="(.+)"/);
            if (match) fileName = match[1];
          }

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;

          document.body.appendChild(a);
          a.click();
          a.remove();

          window.URL.revokeObjectURL(url);
        },
      }),
    }),

    exportSelectedResponses: builder.mutation<
      void,
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
        responseHandler: async (response) => {
          const blob = await response.blob();

          const url = window.URL.createObjectURL(blob);

          const disposition = response.headers.get("Content-Disposition");

          let fileName = "download.xlsx";

          if (disposition) {
            const match = disposition.match(/filename="(.+)"/);
            if (match) fileName = match[1];
          }

          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;

          document.body.appendChild(a);
          a.click();
          a.remove();

          window.URL.revokeObjectURL(url);
        },
      }),
    }),
  }),
});

export const {
  useExportSurveyFullMutation,
  useExportSelectedResponsesMutation,
} = exportDataApi;
