import { useMemo, useState } from "react";

import { Box, IconButton, Tooltip } from "@mui/material";
import {
  type MRT_Icons,
  type MRT_TableInstance,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MaterialReactTable,
} from "material-react-table";
import { BiShow, BiSolidHide } from "react-icons/bi";
import { FaFilter, FaFilterCircleXmark } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";
import { useParams } from "react-router-dom";

import { useGetResultsQuery } from "../../app/slices/resultsApiSlice";
import { RowData } from "../../utils/types";
import DownloadResponsesModal from "../Modals/DownloadResponsesModal";

const CustomIcons: Partial<MRT_Icons> = {
  FilterListIcon: () => <FaFilter />,
  FilterListOffIcon: () => <FaFilterCircleXmark />,

  ViewColumnIcon: () => <BiShow />,
  VisibilityOffIcon: () => <BiSolidHide />,
};

const ResponsesTable = () => {
  const { surveyID } = useParams();

  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [_responsesData, setResponsesData] = useState("");
  const [_downloadFileFormat, setDownloadFileFormat] = useState("csv");
  const [rowData, setRowData] = useState<RowData[]>([]);

  const handleOpen = () => setOpenDownloadModal(true);
  const handleClose = () => setOpenDownloadModal(false);

  const { data: results, isLoading: isDataLoading } = useGetResultsQuery(
    surveyID!
  );

  const questions = results?.questions ?? [];

  const handleDownload = (table: MRT_TableInstance<RowData>) => {
    handleOpen();
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    setRowData(selectedRows);
  };

  const columns = useMemo(() => {
    if (!questions) return [];
    const colData = questions.map((question) => ({
      accessorKey: question.questionID,
      header: question.text,
      size: 150,
    }));

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

      return row;
    });

    return rowData;
  }, [questions]);

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
            border: "1px solid #F3F3F3",
            "& .MuiTableCell-root": {
              border: "1px solid #F3F3F3",
            },
            "& .MuiCheckbox-root": {
              transform: "scale(1.2)",
            },
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#0A86DA",
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
        handleClose={handleClose}
      />
    </>
  );
};

export default ResponsesTable;
