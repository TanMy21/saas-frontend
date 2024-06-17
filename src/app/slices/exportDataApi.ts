import { saveAs } from "file-saver";
import { apiSlice } from "../api/apiSlice";
import { exportDataDate } from "../../utils/formatDate";

export const exportDataApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    exportData: builder.mutation({
      query: ({ format, selectedRows, columns }) => ({
        url: `/export/${format}`,
        method: "POST",
        body: { selectedRows, columns },
        responseHandler: (response) => response.blob(),
      }),
      async onQueryStarted({ format }, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const today = exportDataDate(new Date().toISOString());
          const blob = new Blob([data], { type: data.type });
          saveAs(blob, `export_${today}.${format}`);
        } catch (error) {
          console.error("Export Failed: ", error);
          throw error;
        }
      },
    }),
  }),
});

export const { useExportDataMutation } = exportDataApi;
