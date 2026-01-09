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
          height: "96vh", // ✅ USE HEIGHT, NOT maxHeight
          minHeight: 0, // 🔑 critical
          borderRadius: "8px",
        }}
      >
        <ResponsesTable />
      </Box>
    </>
  );
};

export default ResultResponses;
