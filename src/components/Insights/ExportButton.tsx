import { Button } from "@mui/material";

import { useExportSurveyFullMutation } from "../../app/slices/exportDataApi";

export const ExportButton = ({ surveyID }: { surveyID: string }) => {
  const [exportSurveyFull, { isLoading }] = useExportSurveyFullMutation();

  const handleExport = async () => {
    try {
      await exportSurveyFull({
        surveyID,
        format: "xlsx", // change to "csv" if needed
      });
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleExport}
      disabled={isLoading}
      sx={{
        textTransform: "capitalize",
        borderRadius: "8px",
      }}
    >
      {isLoading ? "Exporting..." : "Export Full Data"}
    </Button>
  );
};
