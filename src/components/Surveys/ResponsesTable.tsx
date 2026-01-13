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
        state={{
          isLoading: isDataLoading,
          showProgressBars: isDataLoading,
          showSkeletons: isDataLoading,
        }}
        muiTableProps={{
          sx: {
            minWidth: "max-content",
            borderRadius: "16px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            backgroundColor: "#ffffff",
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          },
        }}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
            border: "1px solid rgba(0, 0, 0, 0.04)",
            backgroundColor: "#ffffff",
          },
        }}
        muiTableHeadCellProps={({
          column,
        }: {
          column: MRT_Column<RowData>;
        }) => ({
          sx: {
            backgroundColor: "#fafafa",
            fontWeight: 600,
            fontSize: "14px",
            color: "#18181b",
            paddingY: "14px",

            // 👇 vertical separator (RIGHT)
            boxShadow: "inset -1px 0 0 rgba(0, 0, 0, 0.08)",

            // 👇 bottom separator
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",

            ...(column.id === "mrt-row-numbers" && {
              position: "sticky",
              left: 0,
              zIndex: 6,
              backgroundColor: "#fafafa",

              // 👇 pinned column edge
              boxShadow:
                "inset -1px 0 0 rgba(0, 0, 0, 0.16), 2px 0 4px rgba(0, 0, 0, 0.04)",
            }),
          },
        })}
        muiTableBodyCellProps={({
          column,
        }: {
          column: MRT_Column<RowData>;
        }) => ({
          sx: {
            backgroundColor: "#ffffff",
            fontWeight: 600,
            fontSize: "14px",
            color: "#27272a",
            paddingY: "12px",

            // 👇 vertical column separator (RIGHT)
            boxShadow: "inset -1px 0 0 rgba(0, 0, 0, 0.06)",

            // 👇 bottom row separator
            borderBottom: "1px solid rgba(0, 0, 0, 0.04)",

            ...(column.id === "mrt-row-numbers" && {
              position: "sticky",
              left: 0,
              zIndex: 5,
              backgroundColor: "#fafafa",
              fontWeight: 600,
              color: "#71717a",

              // 👇 stronger separator + depth cue
              boxShadow:
                "inset -1px 0 0 rgba(0, 0, 0, 0.12), 2px 0 4px rgba(0, 0, 0, 0.04)",
            }),
          },
        })}
        muiTableBodyRowProps={({ row }) => ({
          sx: {
            backgroundColor: "#ffffff",
            cursor: "pointer",
            transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              backgroundColor: "#f9fafb",
              "& td": {
                backgroundColor: "#f9fafb",
              },
              "& td[data-column-id='mrt-row-numbers']": {
                backgroundColor: "#f4f4f5",
              },
            },
            "&:last-child td": {
              borderBottom: "none",
            },
          },
        })}
        muiSelectCheckboxProps={{
          sx: {
            color: "#a1a1aa",
            "&.Mui-checked": {
              color: "#0ea5e9",
            },
            "&:hover": {
              backgroundColor: "rgba(14, 165, 233, 0.08)",
            },
            "& .MuiSvgIcon-root": {
              fontSize: "20px",
              borderRadius: "4px",
            },
          },
        }}
        muiPaginationProps={{
          sx: {
            "& .MuiPaginationItem-root": {
              backgroundColor: "transparent",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#52525b",
              minWidth: "36px",
              height: "36px",
              margin: "0 2px",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid transparent",
              "&:hover": {
                backgroundColor: "#f4f4f5",
                borderColor: "rgba(0, 0, 0, 0.08)",
              },
              "&.Mui-selected": {
                backgroundColor: "#0ea5e9",
                color: "#ffffff",
                fontWeight: 600,
                border: "1px solid #0ea5e9",
                boxShadow: "0 1px 2px rgba(14, 165, 233, 0.2)",
                "&:hover": {
                  backgroundColor: "#0284c7",
                  borderColor: "#0284c7",
                },
              },
            },
          },
        }}
        muiTopToolbarProps={{
          sx: {
            backgroundColor: "#FBFBFB",
            borderTop: "1px solid #FBFBFB",
            paddingX: 2,
            paddingY: 1.5,
            "& .MuiIconButton-root": {
              borderRadius: "8px",
              color: "#52525b",
              width: "36px",
              height: "36px",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "#f4f4f5",
                color: "#18181b",
              },
            },
          },
        }}
        muiBottomToolbarProps={{
          sx: {
            backgroundColor: "#ffffff",
            borderTop: "1px solid rgba(0, 0, 0, 0.06)",
            paddingY: 1.5,
          },
        }}
        muiTableContainerProps={{
          sx: {
            maxHeight: "70vh",
            "&::-webkit-scrollbar": {
              width: "12px",
              height: "12px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f4f4f5",
              borderRadius: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#d4d4d8",
              borderRadius: "6px",
              border: "3px solid #f4f4f5",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "#a1a1aa",
              },
            },
            "&::-webkit-scrollbar-corner": {
              backgroundColor: "transparent",
            },
            overflowX: "auto",
            overflowY: "auto",
          },
        }}
        displayColumnDefOptions={{
          "mrt-row-numbers": {
            size: 60,
            muiTableHeadCellProps: {
              sx: {
                backgroundColor: "#fafafa",
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
