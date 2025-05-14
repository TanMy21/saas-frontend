import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@mui/joy/Input";
import Switch from "@mui/joy/Switch";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useGetSurveyByIdQuery,
  useUpdateSurveyMutation,
} from "../../app/slices/surveysApiSlice";
import { settingsUpdateSchema } from "../../utils/schema";
import {
  ErrorData,
  SettingsFormData,
  SurveySettingsProps,
} from "../../utils/types";

const SurveySettingsModal = ({
  openSettings,
  setOpenSettings,
}: SurveySettingsProps) => {
  const { surveyID } = useParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const now = dayjs();
  // const [selectedDate, setSelectedDate] = useState(now);
  const [response, setResponse] = useState(false);

  const { data: survey } = useGetSurveyByIdQuery(surveyID, {
    skip: !surveyID,
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [updateSurvey, { isLoading, isSuccess, isError, error }] =
    useUpdateSurveyMutation();

  const {
    title,
    description,
    startDate,
    endDate,
    responseLimit,
    language,
    isTemplate,
  } = survey || {};

  const [template, setTemplate] = useState(isTemplate);

  const handleClose = () => {
    setOpenSettings(false);
  };

  const {
    control,
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsUpdateSchema),
  });

  const submitUpdateData = async (data: SettingsFormData) => {
    try {
      const {
        title,
        description,
        startDate,
        endDate,
        responseLimit,
        language,
        isTemplate,
      } = data;

      await updateSurvey({
        surveyID,
        title,
        description,
        startDate,
        endDate,
        responseLimit: responseLimit ? responseLimit : null,
        language,
        isTemplate,
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

  return (
    <>
      <Modal
        open={openSettings}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "#FFFFFF",
            borderRadius: 5,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: 600,
              // border: "2px solid black",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "12%",
                // border: "2px solid green",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "80%",
                  height: "96%",
                  // border: "2px solid black",
                }}
              >
                <Typography sx={{ fontSize: "24px", fontStyle: "bold" }}>
                  Survey settings
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: "100%", height: "88%" }}>
              <form onSubmit={handleSubmit(submitUpdateData)}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "auto",
                    paddingLeft: "1%",
                    width: "98%",
                    height: "480px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#752FEC",
                      borderRadius: "10px",
                      "&:hover": {
                        background: "#555",
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4%",
                      margin: "auto",
                      width: "98%",
                      minHeight: "100%",
                      // border: "2px solid red",
                    }}
                  >
                    {/* --------------------- Title -------------------- */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8%",
                        margin: "auto",
                        marginTop: "1%",
                        width: "98%",
                        height: "20%",
                        // border: "2px solid orange",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontStyle: "bold",
                          color: "#37416D",
                        }}
                      >
                        Title
                      </Typography>
                      <TextField
                        id="title"
                        defaultValue={title}
                        {...register("title")}
                        sx={{
                          margin: "auto",
                          width: "100%",
                          "& .MuiInputBase-root": {
                            height: "48px",
                            borderRadius: 2,
                            border: "1px solid #e5e7eb",
                            px: 0.5,
                            py: 0.5,
                            "&:hover": { borderColor: "#a3a3a3" },
                            "&.Mui-focused": {
                              borderColor: "transparent",
                            },
                          },
                        }}
                      />
                    </Box>
                    {/* --------------------- Description ----------------------- */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8%",
                        margin: "auto",
                        width: "98%",
                        height: "20%",
                        // border: "2px solid orange",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontStyle: "bold",
                          color: "#37416D",
                        }}
                      >
                        Description
                      </Typography>
                      <TextField
                        id="description"
                        autoFocus
                        defaultValue={description}
                        {...register("description")}
                        sx={{
                          margin: "auto",
                          width: "100%",
                          "& .MuiInputBase-root": {
                            height: "48px",
                            borderRadius: 2,
                            border: "1px solid #e5e7eb",
                            px: 2,
                            py: 1,
                            "&:hover": { borderColor: "#a3a3a3" },
                            "&.Mui-focused": {
                              borderColor: "transparent",
                            },
                          },
                        }}
                      />
                    </Box>
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
                        justifyContent: "space-between",
                        margin: "auto",
                        width: "98%",
                        height: "24%",
                        // border: "2px solid red",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8%",
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
                            defaultValue={startDate ? startDate.toString() : ""}
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  format="DD/MM/YYYY"
                                  value={
                                    value ? dayjs(value, "DD/MM/YYYY") : null
                                  }
                                  // control={control}
                                  onChange={(date) =>
                                    onChange(
                                      date ? date.format("DD/MM/YYYY") : ""
                                    )
                                  }
                                  defaultValue={startDate ? startDate : now}
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
                          gap: "8%",
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
                            defaultValue={endDate ? endDate.toString() : ""}
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  format="DD/MM/YYYY"
                                  value={
                                    value ? dayjs(value, "DD/MM/YYYY") : null
                                  }
                                  onChange={(date) =>
                                    onChange(
                                      date ? date.format("DD/MM/YYYY") : ""
                                    )
                                  }
                                  defaultValue={endDate ? endDate : now}
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
                        </Box>
                      </Box>
                    </Box>
                    {/* --------------------- Response limit -------------------- */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        margin: "auto",
                        width: "98%",
                        height: "24%",
                        // border: "2px solid green",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8%",
                          margin: "auto",
                          width: "100%",
                          height: "96%",
                          // border: "2px solid red",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                            height: "40%",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "16px",
                              fontStyle: "bold",
                              color: "#37416D",
                            }}
                          >
                            Response limit
                          </Typography>
                          <Switch
                            checked={response}
                            onChange={(event) =>
                              setResponse(event.target.checked)
                            }
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            height: "60%",
                          }}
                        >
                          <Input
                            type="number"
                            variant="outlined"
                            disabled={!response}
                            size="lg"
                            defaultValue={responseLimit || 1}
                            {...register("responseLimit", {
                              valueAsNumber: true,
                            })}
                            slotProps={{
                              input: {
                                ref: inputRef,
                                min: 1,
                                max: 5,
                                step: 1,
                              },
                            }}
                            sx={{
                              width: "48%",
                              borderRadius: 3,
                              border: "1px solid #e5e7eb",
                              px: 2,
                              py: 1,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    {/* --------------------- Language -------------------------- */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16%",
                        margin: "auto",
                        width: "98%",
                        height: "16%",
                        // border: "2px solid blue",
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
                          margin: "auto",
                          width: "100%",
                          height: "60%",
                          // border: "2px solid black",
                        }}
                      >
                        <Controller
                          name="language"
                          control={control}
                          defaultValue={language}
                          render={({ field }) => (
                            <Select
                              {...field}
                              // onChange={handleChange}
                              displayEmpty
                              inputProps={{ "aria-label": "Without label" }}
                              sx={{ width: "100%", height: "92%" }}
                              {...register("language")}
                            >
                              <MenuItem value="">
                                <em>Select Language</em>
                              </MenuItem>
                              <MenuItem value={"EN"}>English</MenuItem>
                              <MenuItem value={"HIN"}>Hindi</MenuItem>
                              <MenuItem value={"MAR"}>Marathi</MenuItem>
                              <MenuItem value={"FR"}>French</MenuItem>
                              <MenuItem value={"GER"}>German</MenuItem>
                            </Select>
                          )}
                        />
                      </Box>
                    </Box>
                    {/* --------------------- Template -------------------------- */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        margin: "auto",
                        marginBottom: "20%",
                        width: "98%",
                        height: "20%",
                        // border: "2px solid orange",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          width: "90%",
                          height: "60px",
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
                          Template
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          width: "10%",
                          height: "48%",
                          // border: "2px solid black",
                        }}
                      >
                        <Controller
                          name="isTemplate"
                          control={control}
                          defaultValue={isTemplate}
                          render={({ field }) => (
                            <Switch
                              {...field}
                              checked={template}
                              {...register("isTemplate")}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          )}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {/* --------------------- Buttons ------------------------------- */}
                <Box
                  sx={{
                    margin: "auto",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "98%",
                    height: "20%",
                    marginTop: "4%",
                    // border: "2px solid red",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "12px",
                      width: "36%",
                      height: "100%",
                      // border: "2px solid black",
                    }}
                  >
                    <Button
                      onClick={handleClose}
                      fullWidth
                      variant="outlined"
                      sx={{
                        textTransform: "capitalize",
                        borderRadius: 2,
                        color: "#374151",
                        borderColor: "#E5E7EB",
                        fontWeight: "bold",
                        "&.MuiButton-root:hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      fullWidth
                      variant="outlined"
                      sx={{
                        textTransform: "capitalize",
                        backgroundColor: "#752FEC",
                        color: "white",
                        fontWeight: "bold",
                        "&.MuiButton-root:hover": {
                          bgcolor: "#752FEC",
                        },
                        borderRadius: 2,
                      }}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default SurveySettingsModal;
