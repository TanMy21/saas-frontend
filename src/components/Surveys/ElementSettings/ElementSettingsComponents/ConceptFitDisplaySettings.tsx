import { useEffect, useRef, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PsychologyAltOutlinedIcon from "@mui/icons-material/PsychologyAltOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
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
import { CONCEPT_FIT_DISPLAY_MODE_OPTIONS } from "../../../../utils/constants";
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

  const { control, reset, handleSubmit } = useForm<ConceptFitSettingsForm>({
    defaultValues: getConceptFitDefaults(uiConfig),
  });

  const watchedValues = useWatch({ control });

  /**
   * Hydrates the form from persisted uiConfig.
   * Does not reset while the user has unsaved local edits.
   */
  useEffect(() => {
    if (formTouched) return;

    reset(getConceptFitDefaults(uiConfig));
    setSaveStatus("idle");
  }, [
    questionID,
    uiConfig?.conceptDisplayMode,
    uiConfig?.randomizeAttributes,
    uiConfig?.autoAdvanceOnAnswer,
    formTouched,
    reset,
  ]);

  /**
   * Marks this settings panel as dirty when user edits fields.
   */
  const markFormTouched = () => {
    if (!canEditQuestion) return;

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
   */
  const onSubmit = async (data: ConceptFitSettingsForm) => {
    if (!canEditQuestion || !questionID) return;

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

      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Concept fit settings update error:", error);
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
          <PsychologyAltOutlinedIcon sx={{ color: "#7C3AED", fontSize: 20 }} />

          <Tooltip title="Configure how the Concept Fit stimulus is displayed">
            <Typography>Concept display</Typography>
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
                      const value = event.target.value as ConceptFitDisplayMode;

                      field.onChange(value);
                      markFormTouched();

                      dispatch(setConceptFitDisplayMode(value));

                      updateConceptFitPreview({
                        conceptDisplayMode: value,
                      });
                    }}
                    sx={{
                      height: 42,
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "#F3F4F6",
                      "& .MuiSelect-select": {
                        py: 1,
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
            name="randomizeAttributes"
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
                      updateConceptFitPreview({
                        randomizeAttributes: checked,
                      });
                    }}
                  />
                }
                label="Randomize attributes"
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
                      updateConceptFitPreview({
                        autoAdvanceOnAnswer: checked,
                      });
                    }}
                  />
                }
                label="Auto-advance after answer"
              />
            )}
          />

          <Typography sx={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
            Concept image is static. Attribute words are shown one by one from
            this question’s options.
          </Typography>

          <SettingSaveStatus
            state={isSavingConceptFit ? "saving" : saveStatus}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ConceptFitDisplaySettings;
