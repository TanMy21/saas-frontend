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
        renderToolbarInternalActions={({ table }) => (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <MRT_ToggleGlobalFilterButton table={table} />

            {/* Divider */}
            <Box
              sx={{
                width: "1px",
                height: "24px",
                bgcolor: "divider",
                mx: 0.5,
              }}
            />

            {/* Export Action */}
            <Tooltip title="Download Responses" arrow placement="top">
              <IconButton
                onClick={() => handleDownload(table)}
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                    transform: "translateY(-2px)",
                    boxShadow: 2,
                  },
                }}
              >
                <HiDownload />
              </IconButton>
            </Tooltip>

            {/* Divider */}
            <Box
              sx={{
                width: "1px",
                height: "24px",
                bgcolor: "divider",
                mx: 0.5,
              }}
            />

            {/* View Controls */}
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleDensePaddingButton table={table} />
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
            borderRadius: "16px",
            overflow: "hidden",
            minWidth: "max-content",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #E5E7EB",
          },
        }}
        // Paper container styling
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
        // Header styling
        muiTableHeadCellProps={{
          sx: {
            bgcolor: "#F9FAFB",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#374151",
            borderBottom: "2px solid #E5E7EB",
            "&:hover": {
              bgcolor: "#F3F4F6",
            },
            transition: "background-color 0.2s ease",
          },
        }}
        // Body cell styling
        muiTableBodyCellProps={{
          sx: {
            fontSize: "0.875rem",
            borderBottom: "1px solid #F3F4F6",
            transition: "background-color 0.15s ease",
          },
        }}
        // Row styling with hover effect
        muiTableBodyRowProps={({ row }) => ({
          sx: {
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#F0F9FF",
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
            bgcolor: "#FAFBFC",
            borderBottom: "1px solid #E5E7EB",
            "& .MuiIconButton-root": {
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            },
          },
        }}
        // Bottom toolbar styling
        muiBottomToolbarProps={{
          sx: {
            bgcolor: "#FAFBFC",
            borderTop: "1px solid #E5E7EB",
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
