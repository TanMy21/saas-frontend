import { Box } from "@mui/material";
import ResponsesTable from "./ResponsesTable";

const ResultResponses = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          marginTop: "24px",
          width: "96%",
          maxHeight: "96%",
          // border: "2px solid black",
          borderRadius: "8px",
          "&::-webkit-scrollbar": {
            width: "10px", // Scrollbar width
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1", // Scrollbar track color
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#61A5D2", // Scrollbar thumb color
            borderRadius: "10px", // Rounded corners on the scrollbar thumb
            "&:hover": {
              background: "#555", // Scrollbar thumb hover color
            },
          },
        }}
      >
        <ResponsesTable />
      </Box>
    </>
  );
};

export default ResultResponses;
