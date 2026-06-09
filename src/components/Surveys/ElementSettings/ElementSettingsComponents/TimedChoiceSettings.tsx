import { useEffect, useRef, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { usePermission } from "../../../../context/PermissionContext";
import {
  SettingSaveState,
  TimedChoiceSettingsForm,
} from "../../../../types/surveyBuilderTypes";
import { ElementSettingsProps } from "../../../../utils/types";
import {
  buildTimedChoiceUiConfig,
  getTimedChoiceDefaults,
} from "../../../../utils/utils";

import SettingSaveStatus from "./SettingSaveStatus";

const TimedChoiceSettings = ({ qID }: ElementSettingsProps) => {
  const { canEditQuestion } = usePermission();
  const dispatch = useAppDispatch();

  const [saveStatus, setSaveStatus] = useState<SettingSaveState>("idle");

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = qID || question?.questionID;
  const uiConfig = question?.questionPreferences?.uiConfig || {};

  const [updateQuestionPreferenceUIConfig, { isLoading: isSavingTimer }] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const formDefaults = getTimedChoiceDefaults(uiConfig);

  const { control, reset, handleSubmit } = useForm<TimedChoiceSettingsForm>({
    defaultValues: formDefaults,
  });

  const watchedValues = useWatch({ control });

  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Stores the last confirmed saved timer settings.
   * This lets us show the save indicator only when there is an actual change.
   */
  const lastSavedTimedSettingsRef =
    useRef<TimedChoiceSettingsForm>(formDefaults);

  /**
   * Tracks the active question.
   * This prevents Redux live-preview updates from resetting the form/status while editing.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Hydrates timer settings only when the selected question changes.
   * This keeps the save indicator hidden on initial render.
   */
  useEffect(() => {
    if (!questionID) return;

    if (activeQuestionIDRef.current === questionID) return;

    activeQuestionIDRef.current = questionID;

    const nextDefaults = getTimedChoiceDefaults(uiConfig);

    lastSavedTimedSettingsRef.current = nextDefaults;

    reset(nextDefaults);
    setFormTouched(false);
    setSaveStatus("idle");
  }, [
    questionID,
    uiConfig?.timeLimitMs,
    uiConfig?.showCountdown,
    uiConfig?.autoAdvanceOnAnswer,
    uiConfig?.allowTimeout,
    reset,
  ]);

  /**
   * Checks whether the timer settings actually changed from the last saved backend state.
   */
  const hasActualTimedSettingsChange = (data: TimedChoiceSettingsForm) => {
    const lastSaved = lastSavedTimedSettingsRef.current;

    return (
      data.timeLimitSeconds !== lastSaved.timeLimitSeconds ||
      data.showCountdown !== lastSaved.showCountdown ||
      data.allowTimeout !== lastSaved.allowTimeout ||
      data.autoAdvanceOnAnswer !== lastSaved.autoAdvanceOnAnswer ||
      data.timedChoiceDisplayMode !== lastSaved.timedChoiceDisplayMode
    );
  };

  /**
   * Marks the settings form as dirty only when user can edit.
   * If values return to the saved baseline, the indicator is hidden again.
   */
  const markFormTouched = (nextData?: TimedChoiceSettingsForm) => {
    if (!canEditQuestion) return;

    if (nextData && !hasActualTimedSettingsChange(nextData)) {
      setFormTouched(false);
      setSaveStatus("idle");
      return;
    }

    setFormTouched(true);
    setSaveStatus("dirty");
  };

  /**
   * Persists timed choice uiConfig to the backend.
   * Saves only when there is an actual change from the last saved value.
   */
  const onSubmit = async (data: TimedChoiceSettingsForm) => {
    if (!canEditQuestion || !questionID) return;

    if (!hasActualTimedSettingsChange(data)) {
      setFormTouched(false);
      setSaveStatus("idle");
      return;
    }

    const nextUiConfig = buildTimedChoiceUiConfig(data, uiConfig);

    try {
      setSaveStatus("saving");

      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig: nextUiConfig,
      }).unwrap();

      /**
       * Keeps the selected question in Redux synced with the saved backend value.
       * This prevents waiting for page navigation/refetch to see the new timer config.
       */
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
      lastSavedTimedSettingsRef.current = data;

      setSaveStatus("saved");
      setFormTouched(false);
    } catch (error) {
      setSaveStatus("error");
      setFormTouched(false);
      console.error("Timed choice settings update error:", error);
    }
  };

  /**
   * Debounces timer settings updates like your existing settings panels.
   */
  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit, (errors) => {
        console.error("Timed choice settings validation error:", errors);
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
        aria-controls="timed-choice-settings-content"
        id="timed-choice-settings-header"
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
          <Tooltip title="Configure timer behavior for this timed choice question">
            <Typography>Time settings</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: { md: 2, xl: 1 }, pb: 2, p:2 }}>
        <Box
          component="form"
          onSubmit={(event) => event.preventDefault()}
          sx={{
            display: "flex",
            width:"92%",
            flexDirection: "column",
            gap: 2,
            opacity: canEditQuestion ? 1 : 0.8,
            pointerEvents: canEditQuestion ? "auto" : "none",
            mx:"auto"
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
              Time limit
            </Typography>

            <Controller
              name="timeLimitSeconds"
              control={control}
              render={({ field }) => (
                <TextField
                  type="number"
                  variant="standard"
                  disabled={!canEditQuestion}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    if (!canEditQuestion) return;

                    const value = Number(event.target.value);
                    const safeValue = Number.isNaN(value) ? 3 : value;

                    const clampedValue = Math.min(
                      Math.max(safeValue || 1, 1),
                      30,
                    );

                    field.onChange(clampedValue);

                    const nextData = {
                      ...(watchedValues as TimedChoiceSettingsForm),
                      timeLimitSeconds: clampedValue,
                    };

                    markFormTouched(nextData);

                    dispatch(
                      updateQuestionField({
                        key: "questionPreferences",
                        value: {
                          ...question?.questionPreferences,
                          uiConfig: {
                            ...uiConfig,
                            timeLimitMs: clampedValue * 1000,
                          },
                        } as any,
                      }),
                    );
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
              )}
            />
          </Box>

          <Controller
            name="showCountdown"
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

                      const nextData = {
                        ...(watchedValues as TimedChoiceSettingsForm),
                        showCountdown: checked,
                      };

                      markFormTouched(nextData);

                      dispatch(
                        updateQuestionField({
                          key: "questionPreferences",
                          value: {
                            ...question?.questionPreferences,
                            uiConfig: {
                              ...uiConfig,
                              showCountdown: checked,
                            },
                          } as any,
                        }),
                      );
                    }}
                  />
                }
                label="Show countdown"
              />
            )}
          />

          <Controller
            name="allowTimeout"
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

                      const nextData = {
                        ...(watchedValues as TimedChoiceSettingsForm),
                        allowTimeout: checked,
                      };

                      markFormTouched(nextData);

                      dispatch(
                        updateQuestionField({
                          key: "questionPreferences",
                          value: {
                            ...question?.questionPreferences,
                            uiConfig: {
                              ...uiConfig,
                              allowTimeout: checked,
                            },
                          } as any,
                        }),
                      );
                    }}
                  />
                }
                label="Allow timeout"
              />
            )}
          />

          {saveStatus !== "idle" && (
            <SettingSaveStatus state={isSavingTimer ? "saving" : saveStatus} />
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default TimedChoiceSettings;
