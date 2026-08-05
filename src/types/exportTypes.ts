export type ExportJobStartResponse = {
  message: string;
  jobID: string;
  surveyID: string;
  status: "PENDING";
};

export type ExportJobStatusResponse = {
  jobID: string;
  surveyID: string;
  type: "FULL" | "SELECTED";
  format: "CSV" | "XLSX";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  fileName?: string | null;
  downloadUrl?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  errorMessage?: string | null;
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
};
