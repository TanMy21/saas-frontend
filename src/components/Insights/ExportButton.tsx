import { useState } from "react";

import { Button } from "@mui/material";
import { FileDown } from "lucide-react";

import DownloadResponsesModal from "../Modals/DownloadResponsesModal";

export const ExportButton = ({ surveyID }: { surveyID: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="text"
        sx={{
          height: "36px",
          textTransform: "none",
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#374151",
          my: 0.5,
          px: 1.5,
          py: 0.8,
          minWidth: "auto",
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.04)",
            color: "#111827",
          },
          "&:active": {
            bgcolor: "rgba(0,0,0,0.08)",
          },
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <FileDown size={20} strokeWidth={2} />
        Download Results
      </Button>

      {/* MODAL */}
      <DownloadResponsesModal
        open={open}
        handleClose={() => setOpen(false)}
        surveyID={surveyID}
        rowData={[]}
        mode={"ALL"}
      />
    </>
  );
};
