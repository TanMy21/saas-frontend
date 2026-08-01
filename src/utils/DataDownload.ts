import { writeToString } from "fast-csv";
import { saveAs } from "file-saver";
import type { MRT_ColumnDef } from "material-react-table";
import { build } from "node-xlsx";
import { createPdf } from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

import { RowData } from "./types";

export const exportToCsv = (
  selectedRows: RowData[],
  columns: MRT_ColumnDef<RowData>[],
) => {
  const headers = columns.map((col) => col.header);
  const csvRows = selectedRows.map((row) =>
    columns.map((col) => row[col.accessorKey || ""]),
  );

  writeToString([headers, ...csvRows], { headers: true })
    .then((data) => {
      const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "export.csv");
    })
    .catch((err) => console.error(err));
};

export const exportToXlsx = (
  selectedRows: RowData[],
  columns: MRT_ColumnDef<RowData>[],
) => {
  // Create headers from the columns
  const headers = columns.map((col) => col.header);

  // Map rows to match headers
  const data = selectedRows.map((row) =>
    columns.map((col) => row[col.accessorKey as string] || ""),
  );

  // Combine headers and data
  const worksheetData = [headers, ...data];

  const sheetOptions = {
    "!cols": columns.map(() => ({ wch: 10 })), // setting column width
  };

  // Create worksheet

  const buffer = build([
    { name: "mySheetName", data: worksheetData, options: sheetOptions },
  ]);
  const bytes = Uint8Array.from(buffer);
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "export.xlsx");
};

export const exportToPdf = (
  selectedRows: RowData[],
  columns: MRT_ColumnDef<RowData>[],
) => {
  // Create headers from the columns
  const headers = columns.map((col) => col.header);

  // Map rows to match headers
  const data = selectedRows.map((row) =>
    columns.map((col) => String(row[col.accessorKey as string] ?? "")),
  );

  // Create document definition
  const docDefinition: TDocumentDefinitions = {
    content: [
      {
        table: {
          headerRows: 1,
          widths: Array(headers.length).fill("*"),
          body: [headers, ...data],
        },
      },
    ],
  };

  // Generate PDF and trigger download
  createPdf(docDefinition).download("export.pdf");
};
