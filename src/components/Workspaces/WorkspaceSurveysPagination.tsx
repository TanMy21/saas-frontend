import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Button, Typography } from "@mui/material";

import { WorkspaceSurveysPaginationProps } from "../../utils/types";

const WorkspaceSurveysPagination = ({
  page,
  limit,
  total,
  onPageChange,
  viewMode,
}: WorkspaceSurveysPaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        pr: 2,
        gap: 2,
        width: "100%",
        height: "48px",
        marginTop:
          viewMode === "list"
            ? { lg: "0%", xl: "0%" }
            : { lg: "0%", xl: "0%" },
        // border: "2px solid blue",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 0.4,
          width: "8%",
          height: "96%",
          // border: "2px solid green",
        }}
      >
        <Typography
          sx={{ fontSize: 16, fontWeight: "bold" }}
        >{`${start}-${end}`}</Typography>
        <Typography
          sx={{ fontSize: 16, fontWeight: "bold" }}
        >{`of ${total}`}</Typography>
      </Box>
      <Button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        variant="text"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: 32,
          height: 32,
          color: "#022B67",
          fontSize: 20,
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
          },
          // border: "2px solid green",
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: 32, fontWeight: "bold" }} />
      </Button>
      <Button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        variant="text"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: 32,
          height: 32,
          color: "#022B67",

          "&:hover": {
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
          },
          // border: "2px solid green",
        }}
      >
        <ChevronRightIcon sx={{ fontSize: 32, fontWeight: "bold" }} />
      </Button>
    </Box>
  );
};

export default WorkspaceSurveysPagination;
