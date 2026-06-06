import { useEffect, useRef, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  Switch,
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
import useAuth from "../../../../hooks/useAuth";
import {
  IATBehaviorSettingsForm,
  SettingSaveState,
} from "../../../../types/surveyBuilderTypes";
import {
  ElementSettingsProps,
  QuestionUIConfig,
} from "../../../../utils/types";
import {
  buildIATBehaviorUiConfig,
  getIATBehaviorDefaults,
} from "../../../../utils/utils";

import SettingSaveStatus from "./SettingSaveStatus";

const IATBehaviorSettings = ({ qID }: ElementSettingsProps) => {
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
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [updateQuestionPreferenceUIConfig, { isLoading: isSavingIAT }] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const { control, reset, handleSubmit } = useForm<IATBehaviorSettingsForm>({
    defaultValues: getIATBehaviorDefaults(uiConfig),
  });

  const watchedValues = useWatch({ control });

  /**
   * Hydrates form from saved uiConfig.
   * Does not reset while the creator has unsaved local edits.
   */
  useEffect(() => {
    if (formTouched) return;

    reset(getIATBehaviorDefaults(uiConfig));
    setSaveStatus("idle");
  }, [
    questionID,
    uiConfig?.iatShowKeyboardHints,
    uiConfig?.iatRandomizeStimuli,
    uiConfig?.autoAdvanceOnAnswer,
    formTouched,
    reset,
  ]);

  /**
   * Marks this panel as dirty only when the user can edit.
   */
  const markFormTouched = () => {
    if (!canEditQuestion) return;

    setFormTouched(true);
    setSaveStatus("dirty");
  };

  /**
   * Updates selected question in Redux for instant canvas preview.
   */
  const updateIATPreview = (partialUiConfig: Partial<QuestionUIConfig>) => {
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
   * Persists IAT behavior settings into questionPreferences.uiConfig.
   */
  const onSubmit = async (data: IATBehaviorSettingsForm) => {
    if (!canEditQuestion || !questionID) return;

    const nextUiConfig = buildIATBehaviorUiConfig(data, uiConfig);

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
      console.error("IAT behavior settings update error:", error);
      setSaveStatus("error");
    }
  };

  /**
   * Debounces save after settings change.
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
        aria-controls="iat-behavior-settings-content"
        id="iat-behavior-settings-header"
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
          <TuneOutlinedIcon sx={{ color: "#0891B2", fontSize: 20 }} />

          <Tooltip title="Configure IAT task behavior">
            <Typography>IAT behavior</Typography>
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
            gap: 1.5,
            opacity: canEditQuestion ? 1 : 0.8,
            pointerEvents: canEditQuestion ? "auto" : "none",
          }}
        >
          <Controller
            name="iatRandomizeStimuli"
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

                      updateIATPreview({
                        iatRandomizeStimuli: checked,
                      });
                    }}
                  />
                }
                label="Randomize stimuli"
              />
            )}
          />

          <SettingSaveStatus state={isSavingIAT ? "saving" : saveStatus} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default IATBehaviorSettings;
