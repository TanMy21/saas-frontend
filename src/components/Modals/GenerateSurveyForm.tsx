import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useGenerateSurveyMutation } from "../../app/slices/surveysApiSlice";
import { questionTypes } from "../../utils/elementsConfig";
import { generateSurveySchema } from "../../utils/schema";
import {
  ErrorData,
  GenerateSurveyFormData,
  GenerateSurveyFormProps,
} from "../../utils/types";
import GenerateSurveyLoader from "../Loaders/GenerateSurveyLoader";

const GenerateSurveyForm = ({ surveyID, setOpen }: GenerateSurveyFormProps) => {
  const [generateSurvey, { isLoading, isError, error }] =
    useGenerateSurveyMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GenerateSurveyFormData>({
    resolver: zodResolver(generateSurveySchema),
    defaultValues: {
      description: "",
      numberOfQuestions: 4,
      selectedTypes: [],
    },
  });

  const selectedTypes = watch("selectedTypes") || [];

  const addType = (type: string) => {
    if (!selectedTypes.includes(type)) {
      setValue("selectedTypes", [...selectedTypes, type]);
    }
  };

  const removeType = (type: string) => {
    setValue(
      "selectedTypes",
      selectedTypes.filter((t) => t !== type)
    );
  };

  const onSubmit = async (data: GenerateSurveyFormData) => {
    try {
      await generateSurvey({
        surveyID,
        inputText: data.description,
        numberOfQuestions: data.numberOfQuestions,
        questionTypes: data.selectedTypes,
      }).unwrap();
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Error generating survey:", error);
    }
  };

  useEffect(() => {
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
  }, [isError, error]);

  return (
    <>
      {isLoading ? (
        <GenerateSurveyLoader />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                width: "92%",
                height: "720px",
                overflowX: "hidden",
                scrollBehavior: "smooth",
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
                margin: "auto",
                p: 1,
                // border: "2px solid green",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#374151",
                  mb: 1,
                }}
              >
                Enter Survey Topic and Description
              </Typography>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    placeholder="Enter the topic or purpose of the survey..."
                    multiline
                    rows={4}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#374151",
                  mt: 1,
                  mb: 1,
                }}
              >
                Number of Questions
              </Typography>
              <Controller
                name="numberOfQuestions"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    inputProps={{ min: 4 }}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#374151",
                    mt: 1,
                    mb: 1,
                  }}
                >
                  Question Types
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "auto",
                    gap: 1,
                    width: "96%",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#6B7280",
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    Selected Types:
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    rowGap={2}
                    flexWrap="wrap"
                    justifyContent={"flex-start"}
                    alignItems={"flex-start"}
                    mb={2}
                  >
                    {selectedTypes.length > 0 ? (
                      selectedTypes.map((questionType) => {
                        const type = questionTypes.find(
                          (t) => t.type === questionType
                        );
                        return (
                          type && (
                            <Chip
                              key={type.type}
                              label={type.label}
                              icon={type.icon}
                              onDelete={() => removeType(questionType)}
                              sx={{
                                backgroundColor: "#DBEAFE",
                                color: "#1E40AF",
                                border: "1px solid #BFDBFE",
                                p: 1,
                                fontWeight: 300,
                                fontSize: "16px",
                              }}
                            />
                          )
                        );
                      })
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.disabled"
                        fontStyle="italic"
                      >
                        No question types selected
                      </Typography>
                    )}
                  </Stack>
                  {errors.selectedTypes && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 0.5, mb: 1 }}
                    >
                      {errors.selectedTypes.message}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#6B7280",
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    Available Types:
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    rowGap={2}
                    flexWrap="wrap"
                    justifyContent={"flex-start"}
                    alignItems={"flex-start"}
                    mb={2}
                  >
                    {questionTypes.map((type) => (
                      <Chip
                        key={type.id}
                        label={type.label}
                        icon={type.icon}
                        clickable
                        onClick={() => addType(type.type)}
                        disabled={selectedTypes.includes(type.type)}
                        variant="outlined"
                        sx={{
                          p: 2,
                          fontWeight: 300,
                          fontSize: "16px",
                          color: "#374151",
                          border: "1px solid #D1D5DB",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "60px",
              justifyContent: "flex-end",
              p: 1,
              border: "2px solid red",
              borderTop: "1px solid #E0E0E0",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              sx={{
                alignSelf: "flex-end",
                mr: "4%",
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
              Generate
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default GenerateSurveyForm;
