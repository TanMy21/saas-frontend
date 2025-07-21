import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useUpdateSurveyMutation } from "../../app/slices/surveysApiSlice";
import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/typedReduxHooks";
import { useAppTheme } from "../../theme/useAppTheme";
import { settingsUpdateSchema } from "../../utils/schema";
import {
  ErrorData,
  Language,
  SettingsFormData,
  SurveySettingsProps,
} from "../../utils/types";
import FormErrors from "../FormErrors";

const SurveySettingsModal = ({
  surveyID,
  openSettings,
  setOpenSettings,
}: SurveySettingsProps) => {
  const { scrollStyles, textStyles } = useAppTheme();
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
    <Modal
      open={openSettings}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: 400,
          width: 500,
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "16%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "98%",
              height: "98%",
              margin: "auto",
              justifyContent: "space-between",
              alignItems: "center",
              pl: 2,
              pr: 2,
            }}
          >
            <Typography sx={textStyles.modalTitle}>Survey settings</Typography>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "84%",
            borderTop: "2px solid #E0E0E0",
            borderBottom: "2px solid #E0E0E0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "99%",
              // border: "2px solid green",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                width: "96%",
                height: "99%",
                backgroundColor: "#FFFFFF",
                // border: "2px solid blue",
                overflowY: "auto",
                overflowX: "hidden",
                ...scrollStyles.elementsPanel,
              }}
            >
              {isLoading || !surveyID ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ borderRadius: 2 }}
                />
              ) : (
                <form
                  onSubmit={handleSubmit(submitUpdateData)}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2%",
                      flex: 1,
                      width: "100%",
                      height: "100%",
                      // border: "2px solid red",
                    }}
                  >
                    {/* --------------------- Date ------------------------------ */}
                    {/* --------------------- Date Localization required
                    *******************************
                    *******************************
                    *******************************
                    ------------------------------ */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "98%",
                        height: "48%",
                        marginTop: "2%",
                        gap: 2,
                        // border: "2px solid orange",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          margin: "auto",
                          width: "98%",
                          height: "98%",
                          // border: "2px solid red",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1%",
                            width: "48%",
                            height: "96%",
                            // border: "2px solid black",
                          }}
                        >
                          <Box
                            sx={{
                              width: "98%",
                              height: "36%",
                              // border: "2px solid blue",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontStyle: "bold",
                                color: "#37416D",
                              }}
                            >
                              Start date
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: "98%",
                              height: "64%",
                              // border: "2px solid blue",
                            }}
                          >
                            <Controller
                              name="startDate"
                              control={control}
                              render={({
                                field: { onChange, value },
                                fieldState: { error },
                              }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    format="DD/MM/YYYY"
                                    value={
                                      value && dayjs(value).isValid()
                                        ? dayjs(value)
                                        : null
                                    }
                                    // control={control}
                                    onChange={(date) => onChange(date ?? null)}
                                    slotProps={{
                                      textField: {
                                        error: !!error,
                                        helperText: error?.message,
                                      },
                                    }}
                                    sx={{ height: "48px" }}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1%",
                            width: "48%",
                            height: "96%",
                            // border: "2px solid black",
                          }}
                        >
                          <Box
                            sx={{
                              width: "98%",
                              height: "36%",
                              // border: "2px solid blue",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontStyle: "bold",
                                color: "#37416D",
                              }}
                            >
                              End date
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: "98%",
                              height: "64%",
                              // border: "2px solid blue",
                            }}
                          >
                            <Controller
                              name="endDate"
                              control={control}
                              render={({
                                field: { onChange, value },
                                fieldState: { error },
                              }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    format="DD/MM/YYYY"
                                    value={
                                      value && dayjs(value).isValid()
                                        ? dayjs(value)
                                        : null
                                    }
                                    onChange={(date) => onChange(date ?? null)}
                                    slotProps={{
                                      textField: {
                                        error: !!error,
                                        helperText: error?.message,
                                      },
                                    }}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </Box>{" "}
                        </Box>
                      </Box>
                    </Box>

                    {/* --------------------- Language -------------------------- */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "98%",
                        height: "48%",
                        gap: 1,
                        // border: "2px solid orange",
                      }}
                    >
                      <Box
                        sx={{
                          margin: "auto",
                          width: "100%",
                          height: "32%",
                          // border: "2px solid black",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontStyle: "bold",
                            color: "#37416D",
                          }}
                        >
                          Language
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          marginTop: "-2%",
                          width: "100%",
                          height: "60%",
                          // border: "2px solid black",
                        }}
                      >
                        <Controller
                          name="language"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              // onChange={handleChange}
                              displayEmpty
                              inputProps={{ "aria-label": "Select language" }}
                              sx={{ width: "100%", height: "64%" }}
                            >
                              <MenuItem value="">
                                <em>Select Language</em>
                              </MenuItem>
                              {languages?.map((lang: Language) => (
                                <MenuItem key={lang.code} value={lang.code}>
                                  {lang.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </Box>
                      {errors.language && (
                        <FormErrors errors={errors.language.message} />
                      )}
                    </Box>
                  </Box>
                  {/* Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      height: "16%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        margin: "auto",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "12px",
                        width: "96%",
                        height: "98%",
                      }}
                    >
                      <Button
                        onClick={handleClose}
                        fullWidth
                        variant="cancelBtn"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        fullWidth
                        variant="submitBtn2"
                        sx={{ width: "100px" }}
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                    </Box>
                  </Box>
                </form>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SurveySettingsModal;
