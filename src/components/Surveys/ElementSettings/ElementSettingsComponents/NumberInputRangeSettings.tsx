import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import { RootState } from "../../../../app/store";
import { useAppSelector } from "../../../../app/typedReduxHooks";
import { usePermission } from "../../../../context/PermissionContext";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { QuestionUIConfig } from "../../../../utils/types";

import SettingSaveStatus from "./SettingSaveStatus";

const NumberInputRangeSettings = () => {
  const { canEditQuestion } = usePermission();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const [updateQuestionPreferenceUIConfig, { isLoading: isSavingNumberRange }] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const { questionID, questionPreferences } = question || {};

  const { minValue, maxValue } = questionPreferences?.uiConfig || {
    minValue: undefined,
    maxValue: undefined,
  };

  const { handleSubmit, control, reset, setValue, getValues } =
    useForm<QuestionUIConfig>({
      resolver: zodResolver(uiConfigPreferenceSchema),
      defaultValues: {
        minValue,
        maxValue,
      },
    });

  const watchedMin = useWatch({
    control,
    name: "minValue",
  });

  const watchedValues = useWatch({ control });

  const [formTouched, setFormTouched] = useState(false);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "dirty" | "saving" | "saved" | "error"
  >("idle");

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Stores the last successfully saved input range.
   * This prevents local form changes from being treated as backend-saved values.
   */
  const lastSavedRangeRef = useRef({
    minValue,
    maxValue,
  });

  /**
   * Tracks the currently selected question.
   * This prevents save status from resetting during normal field edits.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Saves number input range settings.
   * Existing uiConfig keys are preserved so other settings are not removed.
   */
  const onSubmit = async (data: QuestionUIConfig) => {
    if (!canEditQuestion || !questionID) return;

    try {
      if (
        data.minValue !== undefined &&
        data.maxValue !== undefined &&
        data.minValue > data.maxValue
      ) {
        setSaveStatus("error");
        return;
      }

      const nextMinValue = data.minValue;
      const nextMaxValue = data.maxValue;

      const hasNoChanges =
        nextMinValue === lastSavedRangeRef.current.minValue &&
        nextMaxValue === lastSavedRangeRef.current.maxValue;

      /**
       * If the user edits and returns to the last saved values,
       * hide the indicator again because there is nothing to save.
       */
      if (hasNoChanges) {
        setFormTouched(false);
        setSaveStatus("idle");
        return;
      }

      setSaveStatus("saving");

      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig: {
          ...questionPreferences?.uiConfig,
          minValue: nextMinValue,
          maxValue: nextMaxValue,
        },
      }).unwrap();

      /**
       * Update the saved baseline only after backend success.
       */
      lastSavedRangeRef.current = {
        minValue: nextMinValue,
        maxValue: nextMaxValue,
      };

      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Number input range update error:", error);
      setFormTouched(false);
      setSaveStatus("error");
    }
  };

  /**
   * Marks the form as changed after a real user edit.
   * This makes the save indicator appear only after editing.
   */
  const markFormTouched = () => {
    if (!canEditQuestion) return;

    if (!formTouched) {
      setFormTouched(true);
    }

    setSaveStatus("dirty");
  };

  /**
   * Debounces range saves after the user edits min or max.
   */
  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit, (errors) => {
        console.error("Number input range validation error:", errors);
        setFormTouched(false);
        setSaveStatus("error");
      })();
    }, 2500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [watchedValues, formTouched, canEditQuestion, handleSubmit]);

  /**
   * Hydrates the form only when the selected question changes.
   * This keeps the indicator hidden initially and avoids reset flicker.
   */
  useEffect(() => {
    if (!questionID) return;

    if (activeQuestionIDRef.current === questionID) return;

    activeQuestionIDRef.current = questionID;

    lastSavedRangeRef.current = {
      minValue,
      maxValue,
    };

    reset({
      minValue,
      maxValue,
    });

    setFormTouched(false);
    setSaveStatus("idle");
  }, [questionID, minValue, maxValue, reset]);

  /**
   * Keeps maxValue valid when minValue becomes greater than maxValue.
   * Because this changes form data, it also marks the form dirty.
   */
  useEffect(() => {
    if (!canEditQuestion) return;

    const currentMax = getValues("maxValue");

    if (
      watchedMin !== undefined &&
      currentMax !== undefined &&
      watchedMin > currentMax
    ) {
      setValue("maxValue", watchedMin, {
        shouldDirty: true,
        shouldTouch: true,
      });

      markFormTouched();
    }
  }, [watchedMin, canEditQuestion, getValues, setValue]);

  /**
   * Clears pending debounce on unmount.
   */
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0E0E0",
        borderBottom: "1px solid #E5E7EB",
        borderRadius: 0,
        boxShadow: "none",
      }}
      disableGutters
      elevation={0}
      square
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 2,
            fontWeight: 500,
            color: "#453F46",
          }}
        >
          <Tooltip title="Set the input range for the number input">
            <Typography>Input range</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: { md: 1, xl: 1 }, pb: 2 }}>
        <Box
          mt={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "96%",
            marginLeft: "1%",
          }}
        >
          {/* MIN */}
          <Box
            mt={1}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "column", xl: "row" },
              justifyContent: "flex-start",
              alignItems: { xs: "flex-start", md: "flex-start", xl: "center" },
              width: "100%",
              minHeight: "48px",
              gap: { md: 1 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: { xs: "100%", xl: "60%" },
                height: "100%",
                fontWeight: 500,
                fontSize: "16px",
                color: "#3F3F46",
                mb: { md: 1 },
              }}
            >
              Min number
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
              }}
            >
              <Controller
                name="minValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="number"
                    disabled={!canEditQuestion}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        lineHeight: "1.5",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                        fontWeight: 500,
                        cursor: canEditQuestion ? "default" : "not-allowed",
                      },
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        width: { md: "100%", xl: "72%" },
                        height: "100%",
                        fontSize: "15px",
                        backgroundColor: "#F3F4F6",
                        fontWeight: 600,
                        color: "#1F2937",
                        px: 1.5,
                        cursor: canEditQuestion ? "text" : "not-allowed",
                        marginLeft: { md: "0%", xl: "16%" },
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#E5E7EB",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#E0E7FF",
                        },
                      },
                      "& input::placeholder": {
                        color: "#9CA3AF",
                        opacity: 1,
                        fontWeight: 400,
                      },
                    }}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      if (!canEditQuestion) return;

                      const value =
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value);

                      field.onChange(value);
                      markFormTouched();
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          {/* MAX */}
          <Box
            mt={1}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "column", xl: "row" },
              justifyContent: "flex-start",
              alignItems: { xs: "flex-start", md: "flex-start", xl: "center" },
              minHeight: "48px",
              width: "100%",
              gap: { md: 1 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: { xs: "100%", xl: "60%" },
                height: "100%",
                fontWeight: 500,
                fontSize: "16px",
                color: "#3F3F46",
                mb: { md: 1 },
              }}
            >
              Max number
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
                mb: { md: 0.5 },
                ml: { md: 0.5 },
              }}
            >
              <Controller
                name="maxValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="number"
                    disabled={!canEditQuestion}
                    variant="standard"
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                      inputProps: {
                        min: watchedMin ?? undefined,
                      },
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        lineHeight: "1.5",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                        fontWeight: 500,
                        cursor: canEditQuestion ? "default" : "not-allowed",
                      },
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        width: { md: "100%", xl: "72%" },
                        height: "100%",
                        marginLeft: { md: "0%", xl: "16%" },
                        fontSize: "15px",
                        backgroundColor: "#F3F4F6",
                        fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                        fontWeight: 500,
                        color: "#1F2937",
                        px: 1.5,
                        cursor: canEditQuestion ? "text" : "not-allowed",
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#E5E7EB",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#E0E7FF",
                        },
                      },
                      "& input::placeholder": {
                        color: "#9CA3AF",
                        opacity: 1,
                        fontWeight: 400,
                      },
                    }}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      if (!canEditQuestion) return;

                      const value =
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value);

                      field.onChange(value);
                      markFormTouched();
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          {saveStatus !== "idle" && (
            <Box sx={{ mt: 1 }}>
              <SettingSaveStatus
                state={isSavingNumberRange ? "saving" : saveStatus}
              />
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
export default NumberInputRangeSettings;
