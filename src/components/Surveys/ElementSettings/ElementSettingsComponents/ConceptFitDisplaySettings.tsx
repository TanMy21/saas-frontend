import { useEffect, useRef, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import {
  setConceptFitDisplayMode,
  updateQuestionField,
} from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import useAuth from "../../../../hooks/useAuth";
import {
  ConceptFitDisplayMode,
  ConceptFitSettingsForm,
  SettingSaveState,
} from "../../../../types/surveyBuilderTypes";
import {
  CONCEPT_FIT_DISPLAY_MODE_OPTIONS,
  DEFAULT_TIMER_SECONDS,
} from "../../../../utils/constants";
import {
  ElementSettingsProps,
  QuestionUIConfig,
} from "../../../../utils/types";
import {
  buildConceptFitUiConfig,
  getConceptFitDefaults,
} from "../../../../utils/utils";

import SettingSaveStatus from "./SettingSaveStatus";

const ConceptFitDisplaySettings = ({ qID }: ElementSettingsProps) => {
  const { can } = useAuth();
  const canEditQuestion = can("UPDATE_QUESTION");
  const dispatch = useAppDispatch();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = qID || question?.questionID;
  const uiConfig = question?.questionPreferences?.uiConfig || {};

  const [saveStatus, setSaveStatus] = useState<SettingSaveState>("idle");
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [updateQuestionPreferenceUIConfig, { isLoading: isSavingConceptFit }] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const formDefaults = getConceptFitDefaults(uiConfig);

  const { control, reset, handleSubmit } = useForm<ConceptFitSettingsForm>({
    defaultValues: formDefaults,
  });

  const watchedValues = useWatch({ control });

  /**
   * Stores the last confirmed saved Concept Fit settings.
   * This lets us show the save indicator only when there is an actual change.
   */
  const lastSavedConceptFitSettingsRef =
    useRef<ConceptFitSettingsForm>(formDefaults);

  /**
   * Tracks the active selected question.
   * This prevents Redux live-preview changes from resetting the form/status while editing.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Hydrates the form only when the selected question changes.
   * This keeps the save indicator hidden on initial render.
   */
  useEffect(() => {
    if (!questionID) return;

    if (activeQuestionIDRef.current === questionID) return;

    activeQuestionIDRef.current = questionID;

    const nextDefaults = getConceptFitDefaults(uiConfig);

    lastSavedConceptFitSettingsRef.current = nextDefaults;

    reset(nextDefaults);
    setFormTouched(false);
    setSaveStatus("idle");
  }, [
    questionID,
    uiConfig?.conceptDisplayMode,
    uiConfig?.randomizeAttributes,
    uiConfig?.autoAdvanceOnAnswer,
    uiConfig?.timeLimitMs,
    reset,
  ]);

  /**
   * Checks whether Concept Fit settings actually changed from the last saved backend state.
   */
  const hasActualConceptFitChange = (data: ConceptFitSettingsForm) => {
    const lastSaved = lastSavedConceptFitSettingsRef.current;

    return (
      data.conceptDisplayMode !== lastSaved.conceptDisplayMode ||
      data.randomizeAttributes !== lastSaved.randomizeAttributes ||
      data.autoAdvanceOnAnswer !== lastSaved.autoAdvanceOnAnswer ||
      data.timeLimitSeconds !== lastSaved.timeLimitSeconds
    );
  };

  /**
   * Marks this settings panel as dirty only when values differ from the saved baseline.
   */
  const markFormTouched = (nextData?: ConceptFitSettingsForm) => {
    if (!canEditQuestion) return;

    if (nextData && !hasActualConceptFitChange(nextData)) {
      setFormTouched(false);
      setSaveStatus("idle");
      return;
    }

    setFormTouched(true);
    setSaveStatus("dirty");
  };

  /**
   * Updates selected question in Redux for instant canvas preview.
   */
  const updateConceptFitPreview = (
    partialUiConfig: Partial<QuestionUIConfig>,
  ) => {
    dispatch(
      updateQuestionField({
        key: "questionPreferences",
        value: {
          ...question?.questionPreferences,
          uiConfig: {
            ...uiConfig,
            ...partialUiConfig,
          },
        } as any,
      }),
    );
  };

  /**
   * Persists Concept Fit display config into questionPreferences.uiConfig.
   * Saves only when there is an actual change.
   */
  const onSubmit = async (data: ConceptFitSettingsForm) => {
    if (!canEditQuestion || !questionID) return;

    if (!hasActualConceptFitChange(data)) {
      setFormTouched(false);
      setSaveStatus("idle");
      return;
    }

    const nextUiConfig = buildConceptFitUiConfig(data, uiConfig);

    try {
      setSaveStatus("saving");

      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig: nextUiConfig,
      }).unwrap();

      dispatch(
        updateQuestionField({
          key: "questionPreferences",
          value: {
            ...question?.questionPreferences,
            uiConfig: nextUiConfig,
          } as any,
        }),
      );

      /**
       * Update saved baseline only after backend confirms the save.
       */
      lastSavedConceptFitSettingsRef.current = data;

      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Concept fit settings update error:", error);
      setFormTouched(false);
      setSaveStatus("error");
    }
  };

  /**
   * Debounces Concept Fit settings save.
   */
  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit, (errors) => {
        console.error("Concept fit settings validation error:", errors);
        setFormTouched(false);
        setSaveStatus("error");
      })();
    }, 1200);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [watchedValues, formTouched, canEditQuestion, handleSubmit]);

  /**
   * Clears pending debounce when the component unmounts.
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
      defaultExpanded={false}
      disableGutters
      elevation={0}
      square
      sx={{
        width: "100%",
        m: "0 !important",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E0E0E0",
        borderRadius: 0,
        boxShadow: "none",
        "&:before": { display: "none" },
        "&.Mui-expanded": {
          m: "0 !important",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="concept-fit-display-settings-content"
        id="concept-fit-display-settings-header"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontWeight: 500,
            color: "#453F46",
          }}
        >
          <Tooltip title="Configure how the Concept Fit stimulus is displayed">
            <Typography>Concept</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: { md: 2, xl: 1 }, pb: 2 }}>
        <Box
          component="form"
          onSubmit={(event) => event.preventDefault()}
          sx={{
            display: "flex",
            width:"94%",
            mx:"auto",
            flexDirection: "column",
            gap: 2,
            opacity: canEditQuestion ? 1 : 0.8,
            pointerEvents: canEditQuestion ? "auto" : "none",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#444D5C",
                fontSize: 13,
                mb: 1,
              }}
            >
              Display mode
            </Typography>

            <Controller
              name="conceptDisplayMode"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <Select
                    disabled={!canEditQuestion}
                    value={field.value}
                    onChange={(event) => {
                      if (!canEditQuestion) return;

                      const value = event.target.value as ConceptFitDisplayMode;

                      field.onChange(value);

                      /**
                       * Updates Redux immediately so the canvas preview changes live.
                       */
                      dispatch(setConceptFitDisplayMode(value));

                      updateConceptFitPreview({
                        conceptDisplayMode: value,
                      });

                      const nextData = {
                        ...(watchedValues as ConceptFitSettingsForm),
                        conceptDisplayMode: value,
                      };

                      markFormTouched(nextData);
                    }}
                    sx={{
                      bgcolor: "#F3F4F6",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        py: 1.2,
                      },
                    }}
                  >
                    {CONCEPT_FIT_DISPLAY_MODE_OPTIONS.map((mode) => (
                      <MenuItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Controller
            name="timeLimitSeconds"
            control={control}
            render={({ field }) => (
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#444D5C",
                    fontSize: 13,
                    mb: 1,
                  }}
                >
                  Timer
                </Typography>

                <TextField
                  type="number"
                  variant="standard"
                  disabled={!canEditQuestion}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    if (!canEditQuestion) return;

                    /**
                     * Keeps Concept Fit timer between 1 and 30 seconds.
                     */
                    const value = Number(event.target.value);

                    const safeValue = Number.isNaN(value)
                      ? DEFAULT_TIMER_SECONDS
                      : value;

                    const clampedValue = Math.min(
                      Math.max(safeValue || 1, 1),
                      30,
                    );

                    field.onChange(clampedValue);

                    updateConceptFitPreview({
                      timeLimitMs: clampedValue * 1000,
                    });

                    const nextData = {
                      ...(watchedValues as ConceptFitSettingsForm),
                      timeLimitSeconds: clampedValue,
                    };

                    markFormTouched(nextData);
                  }}
                  inputProps={{
                    min: 1,
                    max: 30,
                    step: 1,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ color: "#6846E5", marginBottom: 0.5 }}
                      >
                        sec
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": {
                      borderRadius: 1,
                      backgroundColor: "#EEF2FF",
                      height: "36px",
                      minWidth: 80,
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#6846E5",
                      boxShadow: "none",
                      px: 1.25,
                    },
                    "& .MuiInputBase-input": {
                      lineHeight: "1.5",
                      fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                      fontWeight: 700,
                      color: "#6846E5",
                      cursor: canEditQuestion ? "text" : "not-allowed",
                    },
                  }}
                />
              </Box>
            )}
          />

          {/* <Controller
            name="randomizeAttributes"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(field.value)}
                    disabled={!canEditQuestion}
                    onChange={(event) => {
                      if (!canEditQuestion) return;

                      const checked = event.target.checked;

                      field.onChange(checked);

                      updateConceptFitPreview({
                        randomizeAttributes: checked,
                      });

                      const nextData = {
                        ...(watchedValues as ConceptFitSettingsForm),
                        randomizeAttributes: checked,
                      };

                      markFormTouched(nextData);
                    }}
                  />
                }
                label="Randomize attributes"
              />
            )}
          /> */}

          {saveStatus !== "idle" && (
            <SettingSaveStatus
              state={isSavingConceptFit ? "saving" : saveStatus}
            />
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
export default ConceptFitDisplaySettings;
