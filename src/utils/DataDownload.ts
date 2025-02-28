import { writeToString } from "fast-csv";
import { saveAs } from "file-saver";
import type { MRT_ColumnDef } from "material-react-table";
import XLSX from "node-xlsx";
import pdfMake from "pdfmake/build/pdfmake";

import { RowData } from "./types";

export const exportToCsv = (
  selectedRows: RowData[],
  columns: MRT_ColumnDef<RowData>[]
) => {
  const headers = columns.map((col) => col.header);
  const csvRows = selectedRows.map((row) =>
    columns.map((col) => row[col.accessorKey || ""])
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
  columns: MRT_ColumnDef<RowData>[]
) => {
  const headers = columns.map((col) => col.header);

  const data = selectedRows.map((row) =>
    columns.map((col) => row[col.accessorKey as string] || "")
  );

  const worksheetData = [headers, ...data];

  const sheetOptions = {
    "!cols": columns.map(() => ({ wch: 10 })),
  };

  const buffer = XLSX.build([
    { name: "mySheetName", data: worksheetData, options: sheetOptions },
  ]);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "export.xlsx");
};

export const exportToPdf = (
  selectedRows: RowData[],
  columns: MRT_ColumnDef<RowData>[]
) => {
  const headers = columns.map((col) => col.header);

  const data = selectedRows.map((row) =>
    columns.map((col) => row[col.accessorKey as string] || "")
  );

  const docDefinition = {
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

  pdfMake.createPdf(docDefinition).download("export.pdf");
};
