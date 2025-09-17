import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { ChevronDown, Settings } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useUpdateSurveyMutation } from "../../app/slices/surveysApiSlice";
import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/typedReduxHooks";
// import { useAppTheme } from "../../theme/useAppTheme";
import { settingsUpdateSchema } from "../../utils/schema";
import {
  ErrorData,
  SettingsFormData,
  SurveySettingsProps,
} from "../../utils/types";

const SurveySettingsModal = ({
  surveyID,
  openSettings,
  setOpenSettings,
}: SurveySettingsProps) => {
  // const { scrollStyles, textStyles } = useAppTheme();
  const surveyCanvas = useAppSelector(
    (state: RootState) => state.surveyCanvas.data
  );
  const { getSurveyCanvas, languages } = surveyCanvas ?? {};
  const surveySettings = getSurveyCanvas?.SurveySettings;
  const [updateSurvey, { isLoading, isSuccess, isError, error }] =
    useUpdateSurveyMutation();

  const handleClose = () => {
    setOpenSettings(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsUpdateSchema),
    defaultValues: {
      startDate: null,
      endDate: null,
      language: "",
    },
  });

  const submitUpdateData = async (data: SettingsFormData) => {
    try {
      const { startDate, endDate, language } = data;

      await updateSurvey({
        surveyID,
        startDate,
        endDate,
        language,
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Settings Updated!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
      handleClose();
    }

    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isSuccess, isError, error]);

  useEffect(() => {
    if (surveySettings) {
      const { startDate, endDate, Language } = surveySettings;

      reset({
        startDate: startDate ? dayjs(startDate) : null,
        endDate: endDate ? dayjs(endDate) : null,
        language: Language.code ?? "",
      });
    }
  }, [surveySettings, reset]);

  return (
    <Modal open={openSettings} onClose={handleClose}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1500,
          bgcolor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: 12,
            width: "100%",
            maxWidth: 600,
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            animation: "zoom-in-95 0.2s cubic-bezier(.4,0,.2,1)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              pt: 2,
              pb: 1,
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#eff6ff",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Settings style={{ width: 28, height: 28, color: "#2563eb" }} />
              </Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#1e293b",
                  letterSpacing: "-0.01em",
                }}
              >
                Survey Settings
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                p: 1,
                color: "grey.400",
                transition: "all 0.2s",
                "&:hover": {
                  color: "grey.600",
                  bgcolor: "grey.100",
                },
                borderRadius: 2,
              }}
            >
              <CloseIcon style={{ width: 28, height: 28 }} />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ px: 4, py: 2, flex: 1, overflowY: "auto" }}>
            <form onSubmit={handleSubmit(submitUpdateData)}>
              {/* Survey Period */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#374151",
                    mb: 1.5,
                  }}
                >
                  Survey Period
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* Start Date */}
                  <Box sx={{ width: "100%", maxWidth: 320 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#64748b",
                        mb: 1,
                      }}
                    >
                      Start Date
                    </Typography>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="YYYY-MM-DD"
                            value={
                              value && dayjs(value).isValid()
                                ? dayjs(value)
                                : null
                            }
                            onChange={(date) => onChange(date ?? null)}
                            slotProps={{
                              textField: {
                                size: "medium",
                                error: !!error,
                                helperText: error?.message,
                                sx: {
                                  width: "92%",
                                  bgcolor: "#f9fafb",
                                  borderRadius: 2,
                                  border: "1.5px solid #e5e7eb",
                                  "&:hover": {
                                    borderColor: "#d1d5db",
                                  },
                                  "& .MuiOutlinedInput-input": {
                                    px: 2,
                                    py: 1.7,
                                    fontSize: 15,
                                    borderRadius: 2,
                                    color: "#1e293b",
                                  },
                                  "& fieldset": { border: "none" },
                                  minHeight: 52,
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Box>
                  {/* End Date */}
                  <Box sx={{ width: "100%", maxWidth: 320 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#64748b",
                        mb: 1,
                      }}
                    >
                      End Date
                    </Typography>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="YYYY-MM-DD"
                            value={
                              value && dayjs(value).isValid()
                                ? dayjs(value)
                                : null
                            }
                            onChange={(date) => onChange(date ?? null)}
                            slotProps={{
                              textField: {
                                size: "medium",
                                error: !!error,
                                helperText: error?.message,
                                sx: {
                                  width: "92%",
                                  bgcolor: "#f9fafb",
                                  borderRadius: 2,
                                  border: "1.5px solid #e5e7eb",
                                  "&:hover": {
                                    borderColor: "#d1d5db",
                                  },
                                  "& .MuiOutlinedInput-input": {
                                    px: 2,
                                    py: 1.7,
                                    fontSize: 15,
                                    borderRadius: 2,
                                    color: "#1e293b",
                                  },
                                  "& fieldset": { border: "none" },
                                  minHeight: 52,
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Language */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#374151",
                    mb: 1,
                  }}
                >
                  Language
                </Typography>
                <Controller
                  name="language"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      fullWidth
                      displayEmpty
                      error={!!fieldState.error}
                      sx={{
                        bgcolor: "#f9fafb",
                        borderRadius: 2,
                        height: "52px",
                        border: "1.5px solid #e5e7eb",
                        px: 2,
                        py: 1,
                        fontSize: 15,
                        color: "#1e293b",
                        "&hover": {
                          border: "1.5px solid #e5e7eb",
                        },
                      }}
                      inputProps={{
                        sx: {
                          px: 2,
                          py: 1.8,
                          fontSize: 15,
                        },
                        endAdornment: (
                          <InputAdornment position="end" sx={{ mr: 1 }}>
                            <ChevronDown
                              style={{
                                width: 17,
                                height: 17,
                                color: "#5e5a5aff",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      IconComponent={() => null}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: 2,
                            mt: 0.5,
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Language</em>
                      </MenuItem>
                      {languages?.map((lang: any) => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.language && (
                  <Typography color="error" fontSize={13} mt={0.6}>
                    {errors.language.message}
                  </Typography>
                )}
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 2,
                  pt: 2,
                  pb: 1,
                  zIndex: 10,
                  borderTop: "1px solid #f3f4f6",
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outlined"
                  sx={{
                    color: "grey.700",
                    bgcolor: "grey.100",
                    borderColor: "grey.200",
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "grey.200",
                      transform: "scale(0.98)",
                      border: "none",
                    },
                    "&:active": { transform: "scale(0.95)" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  sx={{
                    px: 3,
                    py: 1.3,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#fff",
                    bgcolor: "#2563eb",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px 0 rgba(59,130,246,0.09)",
                    transition: "all 0.18s",
                    "&:hover": {
                      bgcolor: "#1d4ed8",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />
                  ) : null}
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SurveySettingsModal;
