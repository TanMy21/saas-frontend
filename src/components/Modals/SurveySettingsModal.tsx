import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Settings } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { useUpdateSurveyMutation } from "../../app/slices/surveysApiSlice";
import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/typedReduxHooks";
// import { useAppTheme } from "../../theme/useAppTheme";
import { useToast } from "../../hooks/useToast";
import { settingsUpdateSchema } from "../../utils/schema";
import { showToast } from "../../utils/showToast";
import { SettingsFormData, SurveySettingsProps } from "../../utils/types";
import { CustomToggle } from "../Buttons/CustomToggle";

const SurveySettingsModal = ({
  surveyID,
  openSettings,
  setOpenSettings,
}: SurveySettingsProps) => {
  // const { scrollStyles, textStyles } = useAppTheme();
  const surveyCanvas = useAppSelector(
    (state: RootState) => state.surveyCanvas.data,
  );
  const [publishToggled, setPublishToggled] = useState(false);
  const { getSurveyCanvas } = surveyCanvas ?? {};
  const surveySettings = getSurveyCanvas?.SurveySettings;
  const [updateSurvey, { isLoading, isSuccess, isError, error }] =
    useUpdateSurveyMutation();

  const handleClose = () => {
    setOpenSettings(false);
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: null,
      endDate: null,
      language: "",
    },
  });

  const submitUpdateData = async (data: SettingsFormData) => {
    try {
      const { startDate, endDate, language, title, description } = data;

      await updateSurvey({
        title,
        description,
        surveyID,
        startDate,
        endDate,
        language,
      });

      setPublishToggled(false);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await updateSurvey({
        surveyID,
        published: !getSurveyCanvas?.published,
      }).unwrap();

      setPublishToggled((prev) => !prev);

      showToast.success(
        getSurveyCanvas?.published
          ? "Survey unpublished."
          : "Survey published.",
      );
    } catch (err) {
      console.error(err);
    }
  };

  useToast({
    isSuccess: isSuccess && !publishToggled,
    isError,
    error,
    successMessage: "Settings updated!",
    errorFallbackMessage: "Could not update settings. Please try again.",
    successToastOptions: {
      duration: 3000,
    },
    onSuccess: () => {
      handleClose();
    },
  });

  useEffect(() => {
    if (surveySettings) {
      const { startDate, endDate, Language } = surveySettings;

      reset({
        title: getSurveyCanvas.title,
        description: getSurveyCanvas.description,
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
              {/* publish toggle */}

              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#374151",
                    mb: 1,
                  }}
                >
                  {getSurveyCanvas?.published ? "Published" : "Draft"}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#F9FAFB",
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Typography sx={{ fontSize: 14, color: "#4B5563" }}>
                    {getSurveyCanvas?.published
                      ? "Survey is live and accepting responses"
                      : "Survey is in draft mode"}
                  </Typography>

                  <CustomToggle
                    checked={!!getSurveyCanvas?.published}
                    onChange={handleTogglePublish}
                  />
                </Box>
              </Box>

              {/* Title */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    mb: 1,
                    color: "#374151",
                  }}
                >
                  Survey Title
                </Typography>
                <TextField
                  id="title"
                  {...register("title")}
                  variant="outlined"
                  placeholder="Enter survey title..."
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                  sx={{
                    bgcolor: "#F9FAFB",
                    borderRadius: 2,
                    height: "48px",
                    "& .MuiInputBase-root": {
                      borderRadius: 2,
                      fontSize: 16,
                      px: 2,
                      py: 1,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "#0074EB",
                    },
                  }}
                  InputProps={{
                    sx: {
                      minHeight: 48,
                    },
                  }}
                />
              </Box>
              {/* Description */}
              <Box sx={{ mb: 1 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    mb: 1,
                    color: "#374151",
                  }}
                >
                  Description
                </Typography>
                <TextField
                  id="description"
                  {...register("description")}
                  variant="outlined"
                  multiline
                  minRows={4}
                  maxRows={5}
                  placeholder="Describe your survey purpose and goals..."
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                  sx={{
                    bgcolor: "#F9FAFB",
                    borderRadius: 2,
                    "& .MuiInputBase-root": {
                      borderRadius: 2,
                      fontSize: 15,
                      px: 2,
                      py: 1,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "#0074EB",
                    },
                  }}
                  InputProps={{
                    sx: {
                      minHeight: 90,
                    },
                  }}
                />
              </Box>
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
              {/* <Box sx={{ mb: 2 }}>
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
                      IconComponent={(props) => (
                        <ChevronDown
                          {...props}
                          style={{
                            width: 24,
                            height: 24,
                            color: "#5e5a5aff",
                            right: 10,
                          }}
                        />
                      )}
                      sx={{
                        bgcolor: "#f9fafb",
                        borderRadius: 2,
                        height: "52px",
                        border: "1.5px solid #e5e7eb",
                        px: 2,
                        py: 1,
                        fontSize: 15,
                        color: "#1e293b",

                        "&:hover": {
                          border: "1.5px solid #d1d5db",
                        },

                        "&.Mui-focused": {
                          border: "1.5px solid #6366f1",
                          boxShadow: "0 0 0 2px rgba(99,102,241,0.15)",
                        },

                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },

                        "& .MuiSelect-icon": {
                          right: 10,
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: 2,
                            mt: 0.5,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                          },
                        },
                        MenuListProps: {
                          dense: true,
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
              </Box> */}

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
