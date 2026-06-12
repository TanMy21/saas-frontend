import { useEffect, useRef, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
  IATCategorySettingsForm,
  SettingSaveState,
} from "../../../../types/surveyBuilderTypes";
import {
  ElementSettingsProps,
  QuestionUIConfig,
} from "../../../../utils/types";
import {
  buildIATCategoryUiConfig,
  getIATCategoryDefaults,
} from "../../../../utils/utils";

import { IATSettingsTextField } from "./IATSettingsTextField";
import SettingSaveStatus from "./SettingSaveStatus";

const IATCategorySettings = ({ qID }: ElementSettingsProps) => {
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
  const lastHydratedSignatureRef = useRef<string>("");

  const [updateQuestionPreferenceUIConfig, { isLoading: isSavingIAT }] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const formDefaults = getIATCategoryDefaults(uiConfig);

  const { control, reset, handleSubmit, getValues } =
    useForm<IATCategorySettingsForm>({
      defaultValues: formDefaults,
    });

  const watchedValues = useWatch({ control });

  /**
   * Stores the last confirmed saved IAT category settings.
   * This lets the save indicator appear only when values differ from saved backend state.
   */
  const lastSavedIATCategoryRef = useRef<IATCategorySettingsForm>(formDefaults);

  /**
   * Creates a stable signature from the currently saved IAT uiConfig.
   * This lets the form hydrate when uiConfig arrives asynchronously after the first render.
   */
  const iatConfigSignature = JSON.stringify({
    questionID,
    brandA: uiConfig?.iatBrandA?.label ?? "",
    brandB: uiConfig?.iatBrandB?.label ?? "",
    themeA: uiConfig?.iatThemeA?.label ?? "",
    themeB: uiConfig?.iatThemeB?.label ?? "",
    leftKey: uiConfig?.iatLeftKey ?? "",
    rightKey: uiConfig?.iatRightKey ?? "",
  });

  /**
   * Hydrates the form from saved uiConfig.
   * This runs when the selected question changes or when the real uiConfig arrives from the backend.
   */
  useEffect(() => {
    if (!questionID) return;

    /**
     * Do not overwrite the user's current typing while there are unsaved edits.
     */
    if (formTouched) return;

    /**
     * Avoid unnecessary reset calls when the same saved config is already hydrated.
     */
    if (lastHydratedSignatureRef.current === iatConfigSignature) return;

    const nextDefaults = getIATCategoryDefaults(uiConfig);

    lastHydratedSignatureRef.current = iatConfigSignature;
    lastSavedIATCategoryRef.current = nextDefaults;

    reset(nextDefaults);
    setSaveStatus("idle");
  }, [questionID, iatConfigSignature, formTouched, reset]);

  /**
   * Checks whether IAT category settings actually changed from the last saved backend state.
   */
  const hasActualIATCategoryChange = (data: IATCategorySettingsForm) => {
    const lastSaved = lastSavedIATCategoryRef.current;

    return (
      data.iatBrandALabel !== lastSaved.iatBrandALabel ||
      data.iatBrandBLabel !== lastSaved.iatBrandBLabel ||
      data.iatThemeALabel !== lastSaved.iatThemeALabel ||
      data.iatThemeBLabel !== lastSaved.iatThemeBLabel ||
      data.iatLeftKey !== lastSaved.iatLeftKey ||
      data.iatRightKey !== lastSaved.iatRightKey
    );
  };

  /**
   * Marks this panel as dirty only when values differ from the saved baseline.
   */
  const markFormTouched = (nextData: IATCategorySettingsForm) => {
    if (!canEditQuestion) return;

    if (!hasActualIATCategoryChange(nextData)) {
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
  const updateIATPreview = (partialUiConfig: Partial<QuestionUIConfig>) => {
    dispatch(
      updateQuestionField({
        key: "questionPreferences",
        value: {
          ...question?.questionPreferences,
          uiConfig: {
            ...(uiConfig ?? {}),
            ...partialUiConfig,
          },
        } as any,
      }),
    );
  };

  /**
   * Updates one form field, updates Redux preview, and marks the form dirty if needed.
   */
  const handleIATFieldChange = (
    fieldName: keyof IATCategorySettingsForm,
    value: string,
    partialUiConfig: Partial<QuestionUIConfig>,
    onFieldChange: (value: string) => void,
  ) => {
    if (!canEditQuestion) return;

    onFieldChange(value);
    updateIATPreview(partialUiConfig);

    /**
     * Uses getValues so dirty detection is based on the latest form state.
     */
    markFormTouched({
      ...getValues(),
      [fieldName]: value,
    });
  };

  /**
   * Persists IAT category settings into questionPreferences.uiConfig.
   * Saves only when there is an actual change from the saved baseline.
   */
  const onSubmit = async (data: IATCategorySettingsForm) => {
    if (!canEditQuestion || !questionID) return;

    if (!hasActualIATCategoryChange(data)) {
      setFormTouched(false);
      setSaveStatus("idle");
      return;
    }

    const nextUiConfig = buildIATCategoryUiConfig(data, uiConfig);

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
      lastSavedIATCategoryRef.current = data;
      lastHydratedSignatureRef.current = JSON.stringify({
        questionID,
        brandA: nextUiConfig?.iatBrandA?.label ?? "",
        brandB: nextUiConfig?.iatBrandB?.label ?? "",
        themeA: nextUiConfig?.iatThemeA?.label ?? "",
        themeB: nextUiConfig?.iatThemeB?.label ?? "",
        leftKey: nextUiConfig?.iatLeftKey ?? "",
        rightKey: nextUiConfig?.iatRightKey ?? "",
      });

      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("IAT category settings update error:", error);
      setFormTouched(false);
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
      handleSubmit(onSubmit, (errors) => {
        console.error("IAT category settings validation error:", errors);
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
        aria-controls="iat-category-settings-content"
        id="iat-category-settings-header"
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
          <Tooltip title="Configure IAT brands, association groups, and response keys">
            <Typography>IAT categories</Typography>
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
            p: 1,
            pointerEvents: canEditQuestion ? "auto" : "none",
          }}
        >
          <Controller
            name="iatBrandALabel"
            control={control}
            render={({ field }) => (
              <IATSettingsTextField
                label="Concept A"
                value={field.value ?? ""}
                disabled={!canEditQuestion}
                onChange={(value) =>
                  handleIATFieldChange(
                    "iatBrandALabel",
                    value,
                    {
                      iatBrandA: {
                        id: "brand_a",
                        label: value,
                      },
                    },
                    field.onChange,
                  )
                }
              />
            )}
          />

          <Controller
            name="iatBrandBLabel"
            control={control}
            render={({ field }) => (
              <IATSettingsTextField
                label="Concept B"
                value={field.value ?? ""}
                disabled={!canEditQuestion}
                onChange={(value) =>
                  handleIATFieldChange(
                    "iatBrandBLabel",
                    value,
                    {
                      iatBrandB: {
                        id: "brand_b",
                        label: value,
                      },
                    },
                    field.onChange,
                  )
                }
              />
            )}
          />

          <Controller
            name="iatThemeALabel"
            control={control}
            render={({ field }) => (
              <IATSettingsTextField
                label="Association Group A"
                value={field.value ?? ""}
                disabled={!canEditQuestion}
                onChange={(value) =>
                  handleIATFieldChange(
                    "iatThemeALabel",
                    value,
                    {
                      iatThemeA: {
                        id: "theme_a",
                        label: value,
                      },
                    },
                    field.onChange,
                  )
                }
              />
            )}
          />

          <Controller
            name="iatThemeBLabel"
            control={control}
            render={({ field }) => (
              <IATSettingsTextField
                label="Association Group B"
                value={field.value ?? ""}
                disabled={!canEditQuestion}
                onChange={(value) =>
                  handleIATFieldChange(
                    "iatThemeBLabel",
                    value,
                    {
                      iatThemeB: {
                        id: "theme_b",
                        label: value,
                      },
                    },
                    field.onChange,
                  )
                }
              />
            )}
          />

          {saveStatus !== "idle" && (
            <SettingSaveStatus state={isSavingIAT ? "saving" : saveStatus} />
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
export default IATCategorySettings;
