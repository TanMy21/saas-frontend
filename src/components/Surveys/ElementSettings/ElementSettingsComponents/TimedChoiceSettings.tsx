import { useEffect, useRef, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
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

 
  useEffect(() => {
    if (formTouched) return;

    reset(getTimedChoiceDefaults(uiConfig));
    setSaveStatus("idle");
  }, [
    questionID,
    uiConfig?.timeLimitMs,
    uiConfig?.showCountdown,
    uiConfig?.autoAdvanceOnAnswer,
    uiConfig?.allowTimeout,
    formTouched,
    reset,
  ]);

  /**
   * Marks the settings form as touched only when user can edit.
   */
  const markFormTouched = () => {
    if (!canEditQuestion) return;
    setFormTouched(true);
    setSaveStatus("dirty");
  };

  /**
   * Persists timed choice uiConfig to the backend.
   */
  const onSubmit = async (data: TimedChoiceSettingsForm) => {
    if (!canEditQuestion || !questionID) return;

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

      setSaveStatus("saved");
      setFormTouched(false);
    } catch (error) {
      setSaveStatus("error");
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
      handleSubmit(onSubmit)();
    }, 1200);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [watchedValues, formTouched, canEditQuestion, handleSubmit]);

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
        borderTop: "1px solid #E0E0E0",
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
          <TimerOutlinedIcon sx={{ color: "#EA580C", fontSize: 20 }} />
          <Tooltip title="Configure timer behavior for this timed choice question">
            <Typography>Timer</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: { md: 2, xl: 1 }, pb: 2 }}>
        <Box
          component="form"
          onSubmit={(event) => event.preventDefault()}
          sx={{
            display: "flex",
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
              Time limit
            </Typography>

            <Controller
              name="timeLimitSeconds"
              control={control}
              render={({ field }) => (
                <TextField
                  type="number"
                  fullWidth
                  disabled={!canEditQuestion}
                  value={field.value}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    const safeValue = Number.isNaN(value) ? 3 : value;
                    const clampedValue = Math.min(
                      Math.max(safeValue || 1, 1),
                      30,
                    );
                    field.onChange(clampedValue);
                    markFormTouched();
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
                      <InputAdornment position="end">sec</InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      height: "42px",
                      fontSize: "15px",
                      backgroundColor: "#F3F4F6",
                      px: 1.5,
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
                    checked={field.value}
                    disabled={!canEditQuestion}
                    onChange={(event) => {
                      const checked = event.target.checked;

                      field.onChange(checked);
                      markFormTouched();

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
            name="autoAdvanceOnAnswer"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    disabled={!canEditQuestion}
                    onChange={(event) => {
                      const checked = event.target.checked;

                      field.onChange(checked);
                      markFormTouched();

                      dispatch(
                        updateQuestionField({
                          key: "questionPreferences",
                          value: {
                            ...question?.questionPreferences,
                            uiConfig: {
                              ...uiConfig,
                              autoAdvanceOnAnswer: checked,
                            },
                          } as any,
                        }),
                      );
                    }}
                  />
                }
                label="Auto-advance after answer"
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
                    checked={field.value}
                    disabled={!canEditQuestion}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      field.onChange(checked);
                      markFormTouched();
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

          <SettingSaveStatus state={isSavingTimer ? "saving" : saveStatus} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default TimedChoiceSettings;
