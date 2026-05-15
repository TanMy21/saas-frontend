import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Sparkles } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { setAiQuestionsJustAdded } from "../../app/slices/generateSurveyQuestionSlice";
import { hideOverlay, showOverlay } from "../../app/slices/overlaySlice";
import { useAppDispatch } from "../../app/typedReduxHooks";
import { useToast } from "../../hooks/useToast";
import { useAppTheme } from "../../theme/useAppTheme";
import { questionTypes } from "../../utils/elementsConfig";
import { generateSurveySchema } from "../../utils/schema";
import {
  GenerateSurveyFormData,
  GenerateSurveyFormProps,
} from "../../utils/types";

export const GenerateSurveyForm = ({
  generateSurvey,
  isError,
  error,
  handleClose,
}: GenerateSurveyFormProps) => {
  const { surveyID } = useParams();
  const dispatch = useAppDispatch();

  const { scrollStyles } = useAppTheme();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
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

  const toggleQuestionType = (typeId: string) => {
    const current = selectedTypes || [];
    if (current.includes(typeId)) {
      setValue(
        "selectedTypes",
        current.filter((id) => id !== typeId),
      );
    } else {
      setValue("selectedTypes", [...current, typeId]);
    }
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const onSubmit = async (data: GenerateSurveyFormData) => {
    try {
      handleClose(); // close modal

      dispatch(
        showOverlay({
          message: "Understanding your survey topic...",
          variant: "GENERATE",
        }),
      );

      await delay(700);

      dispatch(
        showOverlay({
          message: "Generating relevant questions...",
          variant: "GENERATE",
        }),
      );

      await generateSurvey({
        surveyID: surveyID!,
        inputText: data.description,
        numberOfQuestions: data.numberOfQuestions,
        questionTypes: data.selectedTypes,
        mode: "INITIAL",
      }).unwrap();

      dispatch(
        showOverlay({
          message: "Structuring your survey...",
          variant: "GENERATE",
        }),
      );
      await delay(500);

      dispatch(
        showOverlay({
          message: "Finalizing your survey...",
          variant: "GENERATE",
        }),
      );
      await delay(400);

      dispatch(setAiQuestionsJustAdded());

      dispatch(hideOverlay());
    } catch (error) {
      console.error("Error generating survey:", error);
    }
  };

  useToast({
    isError,
    error,
  });

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: 4,
        py: 3,
        bgcolor: "#fff",
        ...scrollStyles.elementsPanel,
      }}
    >
      <form
        id="generate-survey-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 32 }}
        autoComplete="off"
      >
        {/* Topic Input */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 15,
              color: "#374151",
              mb: 1,
            }}
          >
            Survey Topic & Description
          </Typography>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                minRows={4}
                maxRows={8}
                placeholder="Enter the topic or purpose of the survey..."
                fullWidth
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  background: "#f5f7fa",
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
                inputProps={{ style: { fontSize: 16 } }}
              />
            )}
          />
        </Box>

        {/* Question Count */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 15,
              color: "#374151",
              mb: 1,
            }}
          >
            Number of Questions
          </Typography>
          <Controller
            name="numberOfQuestions"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                variant="outlined"
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                sx={{
                  width: 180,
                  background: "#f5f7fa",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
                inputProps={{
                  min: 4,
                  max: 50,
                  step: 1,
                  style: { fontSize: 16 },
                }}
              />
            )}
          />
        </Box>

        {/* Question Types */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 15,
              color: "#374151",
            }}
          >
            Question Types
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.3 }}>
            Select one or more question types to include
          </Typography>

          {/* Selected Types */}
          {selectedTypes.length > 0 && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                background: "#eff6ff",
                borderRadius: 2,
                border: "2px solid #bae6fd",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#2563eb",
                  mb: 0.5,
                }}
              >
                Selected types ({selectedTypes.length})
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {selectedTypes.map((questionType) => {
                  const type = questionTypes.find(
                    (t) => t.type === questionType,
                  );
                  return (
                    type && (
                      <Box
                        key={questionType}
                        sx={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1,
                          px: 2,
                          py: 0.6,
                          fontSize: 14,
                          fontWeight: 500,
                          color: type.color,
                          bgcolor: type.bgColor,
                          border: `1.5px solid ${type.borderColor}`,
                          borderRadius: 1.5,
                        }}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" || e.key === "Delete") {
                            toggleQuestionType(type.type);
                          }
                        }}
                        aria-label={`${type.label} selected. Press Backspace or Delete to remove.`}
                      >
                        {type.icon}
                        {type.label}

                        <IconButton
                          aria-label={`Remove ${type.label}`}
                          size="small"
                          onClick={() => toggleQuestionType(type.type)}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            width: 22,
                            height: 22,
                            p: 0,
                            borderRadius: "9999px",
                            bgcolor: "#b60b0bff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            "&:hover": { bgcolor: "#b60b0bff" },
                            zIndex: 10,
                          }}
                        >
                          <CloseIcon
                            sx={{ fontSize: 16, color: "#ffffffff" }}
                          />
                        </IconButton>
                      </Box>
                    )
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Available Types */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 14,
                color: "#6b7280",
                mb: 1,
              }}
            >
              Available types:
            </Typography>
            <Grid container spacing={2}>
              {questionTypes.map((type) => {
                const selected = selectedTypes.includes(type.type);
                return (
                  <Grid item xs={6} sm={4} key={type.type}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => toggleQuestionType(type.type)}
                      sx={{
                        p: 0,
                        width: "100%",
                        height: 60,
                        borderRadius: 3,
                        border: selected
                          ? `2px solid ${type.borderColor}`
                          : "2px solid #e5e7eb",
                        background: selected ? type.bgColor : "#fff",
                        color: selected ? type.color : "#334155",
                        fontWeight: 600,
                        fontSize: 14,
                        textTransform: "none",
                        boxShadow: selected
                          ? "0 2px 8px 0 rgba(59,130,246,0.09)"
                          : "none",
                        "&:hover": {
                          background: selected ? type.bgColor : "#f3f4f6",
                          borderColor: selected ? type.borderColor : "#d1d5db",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            bgcolor: selected ? type.bgColor : "#f1f5f9",
                            color: selected ? type.color : "#94a3b8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                        >
                          {type.icon}
                        </Box>
                        <span>{type.label}</span>
                      </Box>
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      </form>

      {/* Footer */}
      <Box
        sx={{
          px: 1,
          py: 1.5,
          borderTop: "1px solid #f0e9e9",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
          bgcolor: "#ffffff",
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            px: 3,
            py: 1.3,
            fontSize: 15,
            fontWeight: 500,
            marginLeft: "8%",
            color: "#374151",
            bgcolor: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: 2,
            transition: "all 0.18s",
            "&:hover": {
              bgcolor: "#f3f4f6",
              borderColor: "#d1d5db",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="generate-survey-form"
          disabled={selectedTypes.length === 0}
          sx={{
            px: 4,
            py: 1.3,
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
            borderRadius: 2,
            boxShadow: "0 2px 8px 0 rgba(59,130,246,0.13)",
            transition: "all 0.18s",
            "&:hover": {
              background: "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
            },
            opacity: selectedTypes.length === 0 ? 0.6 : 1,
          }}
          startIcon={<Sparkles size={18} />}
          onClick={handleSubmit(onSubmit)}
        >
          Generate Questions
        </Button>
      </Box>
    </Box>
  );
};
