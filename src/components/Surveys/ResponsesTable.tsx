import {
  MRT_Icons,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MaterialReactTable,

  //   type MRT_Row,
  // createMRTColumnHelper,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetResultsQuery } from "../../app/slices/resultsApiSlice";
import { FaFilter } from "react-icons/fa6";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { BiShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";
import { HiDownload } from "react-icons/hi";
import { useMemo, useState } from "react";
import DownloadResponsesModal from "../Modals/DownloadResponsesModal";
import { RowData } from "../../utils/types";

//   import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here

// const columnHelper = createMRTColumnHelper();

// const csvConfig = mkConfig({
//   fieldSeparator: ",",
//   decimalSeparator: ".",
//   useKeysAsHeaders: true,
// });

const CustomIcons: Partial<MRT_Icons> = {
  FilterListIcon: () => <FaFilter />,
  FilterListOffIcon: () => <FaFilterCircleXmark />,

  ViewColumnIcon: () => <BiShow />,
  VisibilityOffIcon: () => <BiSolidHide />,
};

const ResponsesTable = () => {
  const { surveyID } = useParams();

  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [responsesData, setResponsesData] = useState("");
  const [downloadFileFormat, setDownloadFileFormat] = useState("csv");
  const [rowData, setRowData] = useState<RowData[]>([]);

  const handleOpen = () => setOpenDownloadModal(true);
  const handleClose = () => setOpenDownloadModal(false);

  const { data: results, isLoading: isDataLoading } = useGetResultsQuery(
    surveyID!
  );

  const questions = results?.questions ?? [];

  //   const handleExportRows = (rows: MRT_Row<Person>[]) => {
  //     const rowData = rows.map((row) => row.original);
  //     const csv = generateCsv(csvConfig)(rowData);
  //     download(csvConfig)(csv);
  //   };

  //   const handleExportData = () => {
  //     const csv = generateCsv(csvConfig)(data);
  //     download(csvConfig)(csv);
  //   };

  // console.log("surveyID Results: ", surveyID);
  // console.log("Results: ", results);
  // console.log("Questions : ", questions);

  const handleDownload = (table: MRT_TableInstance<RowData>) => {
    handleOpen();
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    setRowData(selectedRows);
  };

  console.log("Selected Responses: ", responsesData);
  console.log("Download File Format: ", downloadFileFormat);

  const columns = useMemo(() => {
    if (!questions) return [];
    const colData = questions.map((question) => ({
      accessorKey: question.questionID,
      header: question.text,
      size: 150,
    }));
    // console.log("Columns: ", colData);
    return colData;
  }, [questions]);

  const rows = useMemo(() => {
    if (!questions) return [];
    const numRows = questions[0]?.response.length || 0;
    const rowData = Array.from({ length: numRows }, (_, rowIndex) => {
      const row: { [key: string]: string } = {};
      questions.forEach((question) => {
        const response = question.response[rowIndex]?.response;
        row[question.questionID] = response ? response.toString() : "";
      });
      // console.log("Row: ", row);
      return row;
    });
    // console.log("Row Array: ", rowData);
    return rowData;
  }, [questions]);

  // if (isLoading) return <CircularProgress />;

  // const table = useMaterialReactTable({
  //   columns,
  //   data: rows,
  //   enableRowSelection: true,
  //   columnFilterDisplayMode: "popover",
  //   paginationDisplayMode: "pages",
  //   positionToolbarAlertBanner: "bottom",
  //   renderTopToolbarCustomActions: ({ table }) => (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         gap: "16px",
  //         padding: "8px",
  //         flexWrap: "wrap",
  //       }}
  //     >
  //       <Button
  //         //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
  //         //   onClick={handleExportData}
  //         startIcon={<FileDownloadIcon />}
  //       >
  //         Export All Data
  //       </Button>
  //       <Button
  //         disabled={table.getPrePaginationRowModel().rows.length === 0}
  //         //export all rows, including from the next page, (still respects filtering and sorting)
  //         //   onClick={() =>
  //         //     handleExportRows(table.getPrePaginationRowModel().rows)
  //         //   }
  //         startIcon={<FileDownloadIcon />}
  //       >
  //         Export All Rows
  //       </Button>
  //       <Button
  //         disabled={table.getRowModel().rows.length === 0}
  //         //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
  //         //   onClick={() => handleExportRows(table.getRowModel().rows)}
  //         startIcon={<FileDownloadIcon />}
  //       >
  //         Export Page Rows
  //       </Button>
  //       <Button
  //         disabled={
  //           !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
  //         }
  //         //only export selected rows
  //         //   onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
  //         startIcon={<FileDownloadIcon />}
  //       >
  //         Export Selected Rows
  //       </Button>
  //     </Box>
  //   ),
  // });

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={rows}
        enableRowSelection={true}
        columnFilterDisplayMode={"subheader"}
        paginationDisplayMode={"pages"}
        positionPagination="bottom"
        positionToolbarAlertBanner={"top"}
        enableSorting={true}
        enableRowNumbers={true}
        enableColumnResizing={true}
        icons={CustomIcons}
        renderToolbarInternalActions={({ table }) => {
          return (
            <>
              <MRT_ToggleGlobalFilterButton table={table} />
              <Box>
                {/* add custom button to print table  */}
                <Tooltip title="Download Responses">
                  <IconButton onClick={() => handleDownload(table)}>
                    <HiDownload />
                  </IconButton>
                </Tooltip>

                {/* along-side built-in buttons in whatever order you want them */}

                <MRT_ToggleFiltersButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleDensePaddingButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
                {/* <MRT_ExpandAllButton table={table} /> */}
              </Box>
            </>
          );
        }}
        state={{
          isLoading: isDataLoading ? true : false,
          showProgressBars: isDataLoading ? true : false,
          showSkeletons: isDataLoading ? true : false,
        }}
        muiTableProps={{
          sx: {
            borderRadius: "24px",
            border: "1px solid #F3F3F3", // Show column and row borders
            "& .MuiTableCell-root": {
              border: "1px solid #F3F3F3", // Add border to table cells
            },
            "& .MuiCheckbox-root": {
              transform: "scale(1.2)", // Increase size of select checkbox
            },
            "&::-webkit-scrollbar": {
              width: "8px", // Custom scrollbar width
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#0A86DA", // Custom scrollbar color
              borderRadius: "12px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#0A86DA",
            },
          },
        }}
      />
      <DownloadResponsesModal
        rowData={rowData}
        columns={columns}
        setResponsesData={setResponsesData}
        setDownloadFileFormat={setDownloadFileFormat}
        open={openDownloadModal}
        // setOpen={setOpenDownloadModal}
        handleClose={handleClose}
      />
    </>
  );
};

export default ResponsesTable;
