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
  setTimedChoiceDisplayMode,
  updateQuestionField,
} from "../../../../app/slices/elementSlice";
import {
  useGetOptionsOfQuestionQuery,
  useUpdateOptionTextandValueMutation,
} from "../../../../app/slices/optionApiSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import useAuth from "../../../../hooks/useAuth";
import {
  SettingSaveState,
  TIMED_CHOICE_DISPLAY_MODE_OPTIONS,
  TimedChoiceDisplayMode,
  TimedChoiceSettingsForm,
} from "../../../../types/surveyBuilderTypes";
import { MAX_TIMED_OPTION_LENGTH } from "../../../../utils/constants";
import { showToast } from "../../../../utils/showToast";
import {
  ElementSettingsProps,
  OptionType,
  QuestionUIConfig,
} from "../../../../utils/types";
import {
  buildTimedChoiceUiConfig,
  getTimedChoiceDefaults,
} from "../../../../utils/utils";

import SettingSaveStatus from "./SettingSaveStatus";

const TimedChoiceOptionSettings = ({ qID, canEdit }: ElementSettingsProps) => {
  const { can } = useAuth();
  const canEditQuestion = can("UPDATE_QUESTION");
  const dispatch = useAppDispatch();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = qID || question?.questionID;
  const uiConfig = question?.questionPreferences?.uiConfig || {};

  const { data: options = [] as OptionType[] } =
    useGetOptionsOfQuestionQuery(qID);

  const [updateOptionTextandValue, { isLoading: isSavingOption }] =
    useUpdateOptionTextandValueMutation();

  const [updateQuestionPreferenceUIConfig, { isLoading: isSavingDisplayMode }] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const [saveStatus, setSaveStatus] = useState<SettingSaveState>("idle");

  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { control, reset, handleSubmit } = useForm<TimedChoiceSettingsForm>({
    defaultValues: getTimedChoiceDefaults(uiConfig),
  });

  const watchedValues = useWatch({ control });

  const sortedOptions = [...options]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 2);

  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  /**
   * Stores the last saved display mode config.
   * This prevents Redux live-preview updates from being treated as saved backend state.
   */
  const lastSavedDisplayModeRef = useRef(getTimedChoiceDefaults(uiConfig));

  /**
   * Stores the last saved option text per optionID.
   * This lets option blur/Enter save only when text actually changed.
   */
  const lastSavedOptionTextRef = useRef<Record<string, string>>({});

  /**
   * Tracks the selected question.
   * This prevents form reset/status reset during live preview edits.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Hydrates display mode form only when the selected question changes.
   * This keeps the save indicator hidden initially.
   */
  useEffect(() => {
    if (!questionID) return;

    if (activeQuestionIDRef.current === questionID) return;

    activeQuestionIDRef.current = questionID;

    const nextDefaults = getTimedChoiceDefaults(uiConfig);

    lastSavedDisplayModeRef.current = nextDefaults;

    reset(nextDefaults);
    setFormTouched(false);
    setSaveStatus("idle");
  }, [questionID, uiConfig?.timedChoiceDisplayMode, reset]);

  /**
   * Keeps local input state synced with fetched option rows.
   * Also updates the saved baseline for option labels.
   */
  useEffect(() => {
    const nextValues = sortedOptions.reduce<Record<string, string>>(
      (acc, option) => {
        acc[option.optionID] = option.text || "";
        return acc;
      },
      {},
    );

    setLocalValues(nextValues);
    lastSavedOptionTextRef.current = nextValues;
  }, [options]);

  /**
   * Checks if display mode has actually changed from the last saved value.
   */
  const hasActualDisplayModeChange = (data: TimedChoiceSettingsForm) => {
    return (
      data.timedChoiceDisplayMode !==
      lastSavedDisplayModeRef.current.timedChoiceDisplayMode
    );
  };

  /**
   * Marks display mode settings as dirty only when there is a real user edit.
   */
  const markFormTouched = () => {
    if (!canEditQuestion) return;

    setFormTouched(true);
    setSaveStatus("dirty");
  };

  /**
   * Updates selected question in Redux for instant canvas preview.
   */
  const updateTimedChoicePreview = (
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
   * Persists Timed Choice display mode into questionPreferences.uiConfig.
   * Saves only when the display mode actually changed.
   */
  const onSubmitDisplayMode = async (data: TimedChoiceSettingsForm) => {
    if (!canEditQuestion || !questionID) return;

    if (!hasActualDisplayModeChange(data)) {
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
      lastSavedDisplayModeRef.current = data;

      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Timed choice display mode update error:", error);
      setSaveStatus("error");
      showToast.error("Failed to update timed choice display mode.");
    }
  };

  /**
   * Debounces Timed Choice display mode save.
   */
  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmitDisplayMode, (errors) => {
        console.error("Timed choice display mode validation error:", errors);
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
   * Saves text and value together for a timed-choice option.
   * Saves only when option text actually changed.
   */
  const handleSaveOption = async (option: OptionType) => {
    if (!canEdit) return;

    const nextText = localValues[option.optionID]?.trim();

    if (!nextText) {
      setSaveStatus("error");
      showToast.error("Option text cannot be empty.");
      return;
    }

    const lastSavedText =
      lastSavedOptionTextRef.current[option.optionID] ?? option.text ?? "";

    /**
     * If the user focuses/blurs without changing text,
     * keep the indicator hidden.
     */
    if (nextText === lastSavedText) {
      setSaveStatus("idle");
      return;
    }

    try {
      setSaveStatus("saving");

      await updateOptionTextandValue({
        optionID: option.optionID,
        text: nextText,
        value: nextText,
      }).unwrap();

      /**
       * Update saved baseline only after successful option save.
       */
      lastSavedOptionTextRef.current = {
        ...lastSavedOptionTextRef.current,
        [option.optionID]: nextText,
      };

      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("error");
      console.error("Timed choice option update error:", error);
      showToast.error("Failed to update timed choice option.");
    }
  };

  /**
   * Marks option editing as dirty only when the value differs
   * from the last saved option text.
   */
  const handleOptionTextChange = (option: OptionType, value: string) => {
    const nextValue = value.slice(0, MAX_TIMED_OPTION_LENGTH);

    setLocalValues((prev) => ({
      ...prev,
      [option.optionID]: nextValue,
    }));

    const lastSavedText =
      lastSavedOptionTextRef.current[option.optionID] ?? option.text ?? "";

    if (nextValue.trim() === lastSavedText) {
      setSaveStatus("idle");
      return;
    }

    setSaveStatus("dirty");
  };

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
        aria-controls="timed-choice-options-content"
        id="timed-choice-options-header"
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
          <Tooltip title="Edit timed choice display mode and option labels">
            <Typography>Timed options</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: { md: 2, xl: 1 }, pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.25,
            p: 1,
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
              name="timedChoiceDisplayMode"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <Select
                    disabled={!canEditQuestion}
                    value={field.value}
                    onChange={(event) => {
                      const value = event.target
                        .value as TimedChoiceDisplayMode;

                      field.onChange(value);

                      /**
                       * Updates Redux immediately so canvas switches card mode.
                       */
                      dispatch(setTimedChoiceDisplayMode(value));

                      updateTimedChoicePreview({
                        timedChoiceDisplayMode: value,
                      });

                      if (
                        value ===
                        lastSavedDisplayModeRef.current.timedChoiceDisplayMode
                      ) {
                        setFormTouched(false);
                        setSaveStatus("idle");
                        return;
                      }

                      markFormTouched();
                    }}
                    sx={{
                      bgcolor: "#F3F4F6",
                      borderRadius: 2,
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
                    {TIMED_CHOICE_DISPLAY_MODE_OPTIONS.map((mode) => (
                      <MenuItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              opacity: canEdit ? 1 : 0.8,
              pointerEvents: canEdit ? "auto" : "none",
            }}
          >
            {sortedOptions.map((option, index) => {
              const label = index === 0 ? "Option A" : "Option B";
              const value = localValues[option.optionID] || "";

              return (
                <Box key={option.optionID}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#444D5C",
                      fontSize: 13,
                      mb: 1,
                    }}
                  >
                    {label}
                  </Typography>

                  <TextField
                    fullWidth
                    variant="standard"
                    disabled={!canEdit}
                    value={value}
                    onChange={(event) => {
                      handleOptionTextChange(option, event.target.value);
                    }}
                    onBlur={() => handleSaveOption(option)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSaveOption(option);
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{ color: "#6846E5", marginBottom: 0.5 }}
                        >
                          {`${value.length}/${MAX_TIMED_OPTION_LENGTH}`}
                        </InputAdornment>
                      ),
                      disableUnderline: true,
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        lineHeight: "1.5",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: canEdit ? "text" : "not-allowed",
                        fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                        fontWeight: 500,
                      },
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        height: "42px",
                        fontSize: "15px",
                        backgroundColor: "#F3F4F6",
                        color: "#1F2937",
                        px: 1.5,
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#E5E7EB",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#FFF7ED",
                        },
                      },
                    }}
                  />
                </Box>
              );
            })}

            {saveStatus !== "idle" && (
              <SettingSaveStatus
                state={
                  isSavingOption || isSavingDisplayMode ? "saving" : saveStatus
                }
              />
            )}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
export default TimedChoiceOptionSettings;
