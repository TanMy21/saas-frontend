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
          borderRadius: "8px",
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1", 
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#61A5D2", 
            borderRadius: "10px", 
            "&:hover": {
              background: "#555", 
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
