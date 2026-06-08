import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import {
  updateMaxValue,
  updateMinValue,
} from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { usePermission } from "../../../../context/PermissionContext";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { QuestionUIConfig } from "../../../../utils/types";

import SettingSaveStatus from "./SettingSaveStatus";

const ScaleRangeSettings = () => {
  const { canEditQuestion } = usePermission();
  const dispatch = useAppDispatch();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const [updateQuestionPreferenceUIConfig, { isLoading: isSavingScaleRange }] =
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
   * Stores the last successfully saved slider range.
   * This avoids comparing against Redux live-preview values.
   */
  const lastSavedRangeRef = useRef({
    minValue,
    maxValue,
  });

  /**
   * Tracks the selected question.
   * This prevents Redux preview updates from resetting save status.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Saves slider range settings.
   * Existing uiConfig keys are preserved so other config values are not deleted.
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
        setFormTouched(false);
        return;
      }

      const nextMinValue = data.minValue;
      const nextMaxValue = data.maxValue;

      const hasNoChanges =
        nextMinValue === lastSavedRangeRef.current.minValue &&
        nextMaxValue === lastSavedRangeRef.current.maxValue;

      /**
       * If the user returns to the last saved range,
       * hide the save indicator because there is nothing to save.
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
       * Update saved baseline only after backend success.
       */
      lastSavedRangeRef.current = {
        minValue: nextMinValue,
        maxValue: nextMaxValue,
      };

      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Scale range update error:", error);
      setFormTouched(false);
      setSaveStatus("error");
    }
  };

  /**
   * Marks the form dirty only after a real user change.
   * This keeps the save indicator hidden on initial render.
   */
  const markFormTouched = () => {
    if (!canEditQuestion) return;

    if (!formTouched) {
      setFormTouched(true);
    }

    setSaveStatus("dirty");
  };

  /**
   * Debounces slider range saves after the user edits min or max.
   */
  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit, (errors) => {
        console.error("Scale range validation error:", errors);
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
   * This prevents local Redux preview updates from clearing the indicator.
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
   * Since this changes the form and Redux preview, it marks the form dirty.
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

      dispatch(updateMaxValue(watchedMin));
      markFormTouched();
    }
  }, [watchedMin, canEditQuestion, getValues, setValue, dispatch]);

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

  const rangeOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E0E0E0",
        borderRadius: 0,
        boxShadow: "none",
      }}
      defaultExpanded={false}
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
          <Tooltip title="Set the range for the slider">
            <Typography>Slider range</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8%",
          }}
        >
          {/* MIN */}
          <Box>
            <Controller
              name="minValue"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  variant="standard"
                  fullWidth
                  displayEmpty
                  disableUnderline
                  disabled={!canEditQuestion}
                  sx={{
                    borderRadius: "8px",
                    height: "42px",
                    backgroundColor: "#F3F4F6",
                    fontSize: "15px",
                    fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                    fontWeight: 500,
                    color: "#1F2937",
                    px: 1.5,
                    opacity: canEditQuestion ? 1 : 0.8,
                    cursor: canEditQuestion ? "pointer" : "not-allowed",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#E5E7EB",
                      cursor: canEditQuestion ? "pointer" : "not-allowed",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#E0E7FF",
                      cursor: canEditQuestion ? "pointer" : "not-allowed",
                    },
                    "& .MuiSelect-icon": {
                      color: "#4338CA",
                    },
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: canEditQuestion ? "pointer" : "not-allowed",
                    },
                    mb: saveStatus === "idle" ? 2 : 1,
                  }}
                  onChange={(event) => {
                    if (!canEditQuestion) return;

                    const value = Number(event.target.value);

                    field.onChange(value);

                    /**
                     * Updates Redux immediately for live canvas preview.
                     */
                    dispatch(updateMinValue(value));

                    markFormTouched();
                  }}
                >
                  {rangeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Box>

          <Box
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#3F3F46",
              marginBottom: saveStatus === "idle" ? "8%" : "4%",
            }}
          >
            to
          </Box>

          {/* MAX */}
          <Box>
            <Controller
              name="maxValue"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  variant="standard"
                  fullWidth
                  displayEmpty
                  disableUnderline
                  disabled={!canEditQuestion || !watchedMin}
                  sx={{
                    borderRadius: "8px",
                    height: "42px",
                    backgroundColor: "#F3F4F6",
                    fontSize: "15px",
                    fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                    fontWeight: 500,
                    color: "#1F2937",
                    px: 1.5,
                    opacity: canEditQuestion ? 1 : 0.8,
                    cursor: canEditQuestion ? "pointer" : "not-allowed",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#E5E7EB",
                      cursor: canEditQuestion ? "pointer" : "not-allowed",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#E0E7FF",
                    },
                    "& .MuiSelect-icon": {
                      color: "#4338CA",
                    },
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      opacity: canEditQuestion ? 1 : 0.8,
                      cursor: canEditQuestion ? "pointer" : "not-allowed",
                    },
                    mb: saveStatus === "idle" ? 2 : 1,
                  }}
                  onChange={(event) => {
                    if (!canEditQuestion) return;

                    const value = Number(event.target.value);

                    field.onChange(value);

                    /**
                     * Updates Redux immediately for live canvas preview.
                     */
                    dispatch(updateMaxValue(value));

                    markFormTouched();
                  }}
                >
                  {rangeOptions
                    .filter(
                      (option) =>
                        watchedMin === undefined || option >= watchedMin,
                    )
                    .map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </Box>
        </Box>

        {saveStatus !== "idle" && (
          <Box sx={{ mt: 0.5 }}>
            <SettingSaveStatus
              state={isSavingScaleRange ? "saving" : saveStatus}
            />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ScaleRangeSettings;
