import { useMemo, useState } from "react";

import { Box, IconButton, Tooltip } from "@mui/material";
import {
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MaterialReactTable,
} from "material-react-table";
import type {
  MRT_TableInstance,
  MRT_Icons,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Column,
} from "material-react-table";
import { BiShow, BiSolidHide } from "react-icons/bi";
import { FaFilter, FaFilterCircleXmark } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";
import { useParams } from "react-router-dom";

import { useGetResultsQuery } from "../../app/slices/resultsApiSlice";
import { RowData } from "../../utils/types";
import { formatResponse } from "../../utils/utils";
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
  const [responsesData, setResponsesData] = useState("");
  const [downloadFileFormat, setDownloadFileFormat] = useState("csv");
  const [rowData, setRowData] = useState<RowData[]>([]);

  const handleOpen = () => setOpenDownloadModal(true);
  const handleClose = () => setOpenDownloadModal(false);

  const { data: results, isLoading: isDataLoading } = useGetResultsQuery(
    surveyID!
    // {
    //   skip: !surveyID,
    //   pollingInterval: 30000,
    //   refetchOnFocus: true,
    //   refetchOnMountOrArgChange: true,
    // }
  );

  const questions = results?.questions ?? [];
  const participants = results?.participants ?? [];

  const handleDownload = (table: MRT_TableInstance<RowData>) => {
    handleOpen();
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    setRowData(selectedRows);
  };

  const columns = useMemo<MRT_ColumnDef<RowData>[]>(() => {
    return questions.map((question) => ({
      accessorKey: question.questionID,
      header: question.text,
      size: question.type === "RANK" ? 500 : 180,

      Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => {
        const value = formatResponse(cell.getValue(), question.type);

        if (!value) {
          return (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                fontSize: "12px",
                color: "#6b7280",
                backgroundColor: "#f3f4f6",
                fontStyle: "italic",
              }}
            >
              <span style={{ color: "#9ca3af", fontSize: 12 }}>
                No response
              </span>
            </Box>
          );
        }

        return <>{value}</>;
      },
    }));
  }, [questions]);

  const rows = useMemo<RowData[]>(() => {
    if (!participants.length) return [];

    return participants.map((participant) => {
      const row: RowData = {
        participantID: participant.participantID,
      };

      // Fill each question's response for this participant
      questions.forEach((question) => {
        // EMAIL_CONTACT → comes directly from participant
        if (question.type === "EMAIL_CONTACT") {
          row[question.questionID] = participant.email ?? "";
          return;
        }

        // Find matching response for this participant
        const resp = question.response.find(
          (r) => r.relatedParticipantID === participant.participantID
        );

        row[question?.questionID] = resp?.response ?? null;
      });

      return row;
    });
  }, [participants, questions]);

  console.log("Responses BE: ", results);
  console.log("Rows: ", rows);

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={rows}
        initialState={{
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
          density: "compact",
          columnPinning: { left: ["mrt-row-numbers"] },
        }}
        enableRowSelection={true}
        columnFilterDisplayMode={"subheader"}
        paginationDisplayMode={"pages"}
        positionPagination="bottom"
        positionToolbarAlertBanner={"top"}
        enableSorting={true}
        enableRowNumbers={true}
        enableColumnResizing={true}
        enableColumnOrdering={true}
        enablePinning={true}
        layoutMode="grid"
        enableStickyHeader={true}
        enableRowVirtualization={rows.length > 100}
        icons={CustomIcons}
        renderTopToolbarCustomActions={({ table }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MRT_ToggleDensePaddingButton table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
          </Box>
        )}
        renderToolbarInternalActions={({ table }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MRT_ToggleGlobalFilterButton table={table} />
            <Tooltip title="Download Responses">
              <IconButton
                onClick={() => handleDownload(table)}
                sx={{
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "#F1F1EF",
                  },
                }}
              >
                <HiDownload />
              </IconButton>
            </Tooltip>

            <MRT_ToggleFullScreenButton table={table} />
          </Box>
        )}
        // Loading states
        state={{
          isLoading: isDataLoading,
          showProgressBars: isDataLoading,
          showSkeletons: isDataLoading,
        }}
        // Enhanced table styling
        muiTableProps={{
          sx: {
            minWidth: "max-content",
            borderRadius: "12px",
            border: "1px solid #E9E9E7",
            boxShadow: "none",
            // overflow: "hidden",
            backgroundColor: "#fff",
          },
        }}
        // Paper container styling
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "none",
            border: "none",
            backgroundColor: "transparent",
          },
        }}
        // Header styling
        muiTableHeadCellProps={({
          column,
        }: {
          column: MRT_Column<RowData>;
        }) => ({
          sx: {
            backgroundColor: "#F5F5F5",
            fontWeight: 600,
            color: "#61615D",

            // 👇 vertical separator
            boxShadow: "inset -1px 0 0 #E5E7EB",

            ...(column.id === "mrt-row-numbers" && {
              position: "sticky",
              left: 0,
              zIndex: 5,
              backgroundColor: "#fbfbfc",
              boxShadow: "inset -1px 0 0 #E5E7EB, 2px 0 0 rgba(0,0,0,0.04)",
            }),
          },
        })}
        // Body cell styling
        muiTableBodyCellProps={({
          column,
        }: {
          column: MRT_Column<RowData>;
        }) => ({
          sx: {
            backgroundColor: "#ffffff",
            fontWeight: 600,
            color: "#61615D",

            // 👇 vertical separator
            boxShadow: "inset -1px 0 0 #E5E7EB",

            ...(column.id === "mrt-row-numbers" && {
              position: "sticky",
              left: 0,
              zIndex: 5,
              backgroundColor: "#fbfbfc",

              // stronger edge for pinned column
              boxShadow: "inset -1px 0 0 #E5E7EB, 2px 0 0 rgba(0,0,0,0.04)",
            }),
          },
        })}
        // Row styling with hover effect
        muiTableBodyRowProps={({ row }) => ({
          sx: {
            backgroundColor: "#fff",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#F7F7F5",
              transform: "scale(1.001)",
              boxShadow: "0 2px 8px rgba(10, 134, 218, 0.1)",
            },
            "&:last-child td": {
              borderBottom: "none",
            },
          },
        })}
        // Enhanced checkbox styling
        muiSelectCheckboxProps={{
          sx: {
            transform: "scale(1.1)",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.2)",
            },
            "& .MuiSvgIcon-root": {
              borderRadius: "4px",
            },
          },
        }}
        // Pagination styling
        muiPaginationProps={{
          sx: {
            "& .MuiPaginationItem-root": {
              backgroundColor: "transparent",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#F0F9FF",
                transform: "translateY(-1px)",
              },
              "&.Mui-selected": {
                bgcolor: "#0A86DA",
                color: "white",
                "&:hover": {
                  bgcolor: "#0974C1",
                },
              },
            },
          },
        }}
        // Toolbar styling
        muiTopToolbarProps={{
          sx: {
            bgcolor: "#FBFBFB",
            borderBottom: "1px solid #FBFBFB",
            px: 1,
            "& .MuiIconButton-root": {
              borderRadius: "8px",
              color: "#6B6B6B",
              "&:hover": {
                bgcolor: "#F1F1EF",
              },
            },
          },
        }}
        // Bottom toolbar styling
        muiBottomToolbarProps={{
          sx: {
            bgcolor: "#FBFBFB",
          },
        }}
        // Custom scrollbar
        muiTableContainerProps={{
          sx: {
            maxHeight: "70vh",
            "&::-webkit-scrollbar": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "#F3F4F6",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#0A86DA",
              borderRadius: "10px",
              border: "2px solid #F3F4F6",
              transition: "background-color 0.2s ease",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              bgcolor: "#0974C1",
            },
            "&::-webkit-scrollbar-corner": {
              bgcolor: "transparent",
            },
            overflowX: "auto",
            overflowY: "auto",
          },
        }}
        // Display column options
        displayColumnDefOptions={{
          "mrt-row-numbers": {
            size: 60,
            muiTableHeadCellProps: {
              sx: {
                bgcolor: "#F9FAFB",
              },
            },
          },
          "mrt-row-select": {
            size: 60,
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
