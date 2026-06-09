import { useEffect, useRef, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardAltOutlinedIcon from "@mui/icons-material/KeyboardAltOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  InputAdornment,
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
import useAuth from "../../../../hooks/useAuth";
import {
  IATCategorySettingsForm,
  SettingSaveState,
} from "../../../../types/surveyBuilderTypes";
import { MAX_IAT_CATEGORY_LABEL_LENGTH } from "../../../../utils/constants";
import {
  ElementSettingsProps,
  QuestionUIConfig,
} from "../../../../utils/types";
import {
  buildIATCategoryUiConfig,
  getIATCategoryDefaults,
} from "../../../../utils/utils";

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

  const [updateQuestionPreferenceUIConfig, { isLoading: isSavingIAT }] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const formDefaults = getIATCategoryDefaults(uiConfig);

  const { control, reset, handleSubmit } = useForm<IATCategorySettingsForm>({
    defaultValues: formDefaults,
  });

  const watchedValues = useWatch({ control });

  /**
   * Stores the last confirmed saved IAT category settings.
   * This lets us show the save indicator only when there is an actual change.
   */
  const lastSavedIATCategoryRef = useRef<IATCategorySettingsForm>(formDefaults);

  /**
   * Tracks the active question.
   * This prevents Redux live-preview updates from resetting the form/status while editing.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Hydrates form from saved uiConfig only when the selected question changes.
   * This keeps the save indicator hidden on initial render.
   */
  useEffect(() => {
    if (!questionID) return;

    if (activeQuestionIDRef.current === questionID) return;

    activeQuestionIDRef.current = questionID;

    const nextDefaults = getIATCategoryDefaults(uiConfig);

    lastSavedIATCategoryRef.current = nextDefaults;

    reset(nextDefaults);
    setFormTouched(false);
    setSaveStatus("idle");
  }, [
    questionID,
    uiConfig?.iatLeftCategoryLabel,
    uiConfig?.iatRightCategoryLabel,
    uiConfig?.iatLeftKey,
    uiConfig?.iatRightKey,
    reset,
  ]);

  /**
   * Checks whether IAT category settings actually changed from the last saved backend state.
   */
  const hasActualIATCategoryChange = (data: IATCategorySettingsForm) => {
    const lastSaved = lastSavedIATCategoryRef.current;

    return (
      data.iatLeftCategoryLabel !== lastSaved.iatLeftCategoryLabel ||
      data.iatRightCategoryLabel !== lastSaved.iatRightCategoryLabel ||
      data.iatLeftKey !== lastSaved.iatLeftKey ||
      data.iatRightKey !== lastSaved.iatRightKey
    );
  };

  /**
   * Marks this panel as dirty only when values differ from the saved baseline.
   */
  const markFormTouched = (nextData?: IATCategorySettingsForm) => {
    if (!canEditQuestion) return;

    if (nextData && !hasActualIATCategoryChange(nextData)) {
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
            ...uiConfig,
            ...partialUiConfig,
          },
        } as any,
      }),
    );
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
          <Tooltip title="Configure IAT left/right categories and response keys">
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
            name="iatLeftCategoryLabel"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                variant="standard"
                disabled={!canEditQuestion}
                value={field.value ?? ""}
                onChange={(event) => {
                  if (!canEditQuestion) return;

                  const value = event.target.value.slice(
                    0,
                    MAX_IAT_CATEGORY_LABEL_LENGTH,
                  );

                  field.onChange(value);

                  updateIATPreview({
                    iatLeftCategoryLabel: value,
                  });

                  /**
                   * Builds the next expected form state so actual-change detection
                   * does not depend on React Hook Form updating synchronously.
                   */
                  const nextData = {
                    ...(watchedValues as IATCategorySettingsForm),
                    iatLeftCategoryLabel: value,
                  };

                  markFormTouched(nextData);
                }}
                InputProps={{
                  // Removes the default MUI standard underline.
                  disableUnderline: true,

                  endAdornment: (
                    <InputAdornment position="end">
                      {(field.value ?? "").length}/
                      {MAX_IAT_CATEGORY_LABEL_LENGTH}
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    lineHeight: "1.5",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: canEditQuestion ? "text" : "not-allowed",
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
            )}
          />

          <Controller
            name="iatRightCategoryLabel"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                variant="standard"
                disabled={!canEditQuestion}
                value={field.value ?? ""}
                onChange={(event) => {
                  if (!canEditQuestion) return;

                  const value = event.target.value.slice(
                    0,
                    MAX_IAT_CATEGORY_LABEL_LENGTH,
                  );

                  field.onChange(value);

                  updateIATPreview({
                    iatRightCategoryLabel: value,
                  });

                  /**
                   * Builds the next expected form state so actual-change detection
                   * does not depend on React Hook Form updating synchronously.
                   */
                  const nextData = {
                    ...(watchedValues as IATCategorySettingsForm),
                    iatRightCategoryLabel: value,
                  };

                  markFormTouched(nextData);
                }}
                InputProps={{
                  // Removes the default black underline from MUI standard variant.
                  disableUnderline: true,

                  endAdornment: (
                    <InputAdornment position="end">
                      {(field.value ?? "").length}/
                      {MAX_IAT_CATEGORY_LABEL_LENGTH}
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    lineHeight: "1.5",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: canEditQuestion ? "text" : "not-allowed",
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
