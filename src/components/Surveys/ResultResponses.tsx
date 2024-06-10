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
        }}
      >
        <ResponsesTable />
      </Box>
    </>
  );
};

export default ResultResponses;
