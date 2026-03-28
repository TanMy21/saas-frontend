import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Modal,
  RadioGroup,
} from "@mui/material";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  useExportSelectedResponsesMutation,
  useExportSurveyFullMutation,
} from "../../app/slices/exportDataApi";
import { DownloadFormData, downloadDataSchema } from "../../utils/schema";
import { DownloadResponsesModalProps, ErrorData } from "../../utils/types";

const DownloadResponsesModal = ({
  rowData,
  open,
  handleClose,
  surveyID,
  mode,
}: DownloadResponsesModalProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadDataSchema),
    defaultValues: {
      fileFormatGroup: "csv",
    },
  });

  const selectedFormat = watch("fileFormatGroup");

  const [
    exportSurveyFull,
    { isError: isFullError, error: fullError, isLoading: isFullLoading },
  ] = useExportSurveyFullMutation();

  const [exportSelectedResponses, { isError, error, isLoading }] =
    useExportSelectedResponsesMutation();

  const handleDownloadFormSubmit: SubmitHandler<DownloadFormData> = async (
    data,
  ) => {
    try {
      if (mode === "ALL") {
        await exportSurveyFull({
          surveyID,
          format: data.fileFormatGroup,
        }).unwrap();
      } else {
        await exportSelectedResponses({
          format: data.fileFormatGroup,
          surveyID,
          participantIDs: rowData,
        }).unwrap();
      }

      handleClose();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  useEffect(() => {
    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, { position: "top-right" }),
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }

    if (isFullError) {
      const errorData = fullError as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, { position: "top-right" }),
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError, error]);

  return (
    <Modal open={open} onClose={handleClose}>
      <>
        {/* BACKDROP */}
        <Box
          onClick={handleClose}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(17,24,39,0.4)",
            backdropFilter: "blur(6px)",
          }}
        />

        {/* MODAL */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "white",
            borderRadius: "16px",
            boxShadow: "0px 20px 50px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Box sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                Export Responses
              </Box>
              <Box sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}>
                Choose a format to download your survey data.
              </Box>
            </Box>

            <IconButton
              onClick={handleClose}
              sx={{
                color: "#9ca3af",
                "&:hover": { bgcolor: "#f3f4f6", color: "#374151" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* BODY */}
          <form onSubmit={handleSubmit(handleDownloadFormSubmit)}>
            <Box sx={{ px: 3, py: 3 }}>
              <FormControl error={!!errors.fileFormatGroup} fullWidth>
                <Controller
                  name="fileFormatGroup"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 2,
                        }}
                      >
                        {/* CSV CARD */}
                        <Box
                          onClick={() => field.onChange("csv")}
                          sx={{
                            cursor: "pointer",
                            p: 2,
                            borderRadius: "12px",
                            border:
                              selectedFormat === "csv"
                                ? "2px solid #2563eb"
                                : "2px solid #e5e7eb",
                            bgcolor:
                              selectedFormat === "csv"
                                ? "rgba(37,99,235,0.05)"
                                : "white",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: "#d1d5db",
                              bgcolor: "#f9fafb",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: "8px",
                                bgcolor:
                                  selectedFormat === "csv"
                                    ? "rgba(37,99,235,0.1)"
                                    : "#f3f4f6",
                              }}
                            >
                              📄
                            </Box>

                            {selectedFormat === "csv" && (
                              <Box sx={{ color: "#2563eb" }}>✔</Box>
                            )}
                          </Box>

                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                              CSV Document
                            </Box>
                            <Box sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                              Best for data analysis tools
                            </Box>
                          </Box>
                        </Box>

                        {/* XLSX CARD */}
                        <Box
                          onClick={() => field.onChange("xlsx")}
                          sx={{
                            cursor: "pointer",
                            p: 2,
                            borderRadius: "12px",
                            border:
                              selectedFormat === "xlsx"
                                ? "2px solid #10b981"
                                : "2px solid #e5e7eb",
                            bgcolor:
                              selectedFormat === "xlsx"
                                ? "rgba(16,185,129,0.05)"
                                : "white",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: "#d1d5db",
                              bgcolor: "#f9fafb",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: "8px",
                                bgcolor:
                                  selectedFormat === "xlsx"
                                    ? "rgba(16,185,129,0.1)"
                                    : "#f3f4f6",
                              }}
                            >
                              📊
                            </Box>

                            {selectedFormat === "xlsx" && (
                              <Box sx={{ color: "#10b981" }}>✔</Box>
                            )}
                          </Box>

                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                              Excel (XLSX)
                            </Box>
                            <Box sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                              Best for spreadsheets
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </RadioGroup>
                  )}
                />

                {errors.fileFormatGroup && (
                  <FormHelperText>
                    {errors.fileFormatGroup.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* FOOTER */}
            <Box
              sx={{
                px: 3,
                py: 2,
                bgcolor: "#f9fafb",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: "#d1d5db",
                  color: "#374151",
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading || isFullLoading}
                sx={{
                  textTransform: "none",
                  bgcolor: "#2563eb",
                  "&:hover": { bgcolor: "#1d4ed8" },
                  px: 2.5,
                }}
                variant="contained"
              >
                {isLoading ? "Downloading..." : "Download"}
              </Button>
            </Box>
          </form>
        </Box>
      </>
    </Modal>
  );
};

export default DownloadResponsesModal;
