import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import { RootState } from "../../../../app/store";
import { useAppSelector } from "../../../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../../../context/BuilderRefetchCanvas";
import { usePermission } from "../../../../context/PermissionContext";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { QuestionUIConfig } from "../../../../utils/types";

import SettingSaveStatus from "./SettingSaveStatus";

const MediaOptionSettings = () => {
  const { canEditQuestion } = usePermission();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const refetchCanvas = useSurveyCanvasRefetch();

  const [
    updateQuestionPreferenceUIConfig,
    { isLoading: isSavingMediaOptions },
  ] = useUpdateQuestionPreferenceUIConfigMutation();

  const { questionID, questionPreferences } = question || {};

  const { multipleSelection } = questionPreferences?.uiConfig || {
    multipleSelection: false,
  };

  const { handleSubmit, control, reset } = useForm<QuestionUIConfig>({
    resolver: zodResolver(uiConfigPreferenceSchema),
    defaultValues: {
      multipleSelection: multipleSelection ?? false,
    },
  });

  const watchedValues = useWatch({ control });

  const [formTouched, setFormTouched] = useState(false);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "dirty" | "saving" | "saved" | "error"
  >("idle");

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Stores the last successfully saved media option value.
   * This lets us hide the indicator when there is no real change.
   */
  const lastSavedMediaOptionsRef = useRef({
    multipleSelection: multipleSelection ?? false,
  });

  /**
   * Tracks the selected question.
   * This prevents backend/refetch updates from resetting the save indicator during edits.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Saves media option settings.
   * Existing uiConfig keys are preserved so other settings are not deleted.
   */
  const onSubmit = async (data: QuestionUIConfig) => {
    if (!canEditQuestion || !questionID) return;

    try {
      const nextMultipleSelection = data.multipleSelection ?? false;

      const hasNoChanges =
        nextMultipleSelection ===
        lastSavedMediaOptionsRef.current.multipleSelection;

      /**
       * If the user toggles back to the last saved value,
       * hide the indicator because there is nothing to save.
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
          multipleSelection: nextMultipleSelection,
        },
      }).unwrap();

      /**
       * Update saved baseline only after successful backend save.
       */
      lastSavedMediaOptionsRef.current = {
        multipleSelection: nextMultipleSelection,
      };

      refetchCanvas();

      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Media option settings update error:", error);
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
   * Debounces media option saves after user changes the switch.
   */
  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit, (errors) => {
        console.error("Media option settings validation error:", errors);
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
   * This keeps the indicator hidden initially and avoids save-status flicker.
   */
  useEffect(() => {
    if (!questionID) return;

    if (activeQuestionIDRef.current === questionID) return;

    activeQuestionIDRef.current = questionID;

    const nextMultipleSelection = multipleSelection ?? false;

    lastSavedMediaOptionsRef.current = {
      multipleSelection: nextMultipleSelection,
    };

    reset({
      multipleSelection: nextMultipleSelection,
    });

    setFormTouched(false);
    setSaveStatus("idle");
  }, [questionID, multipleSelection, reset]);

  /**
   * Clears pending debounce on unmount.
   * This prevents stale saves after switching questions or leaving the panel.
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
        borderRadius: 0,
        boxShadow: "none",
        "&:before": { display: "none" },
        "& .MuiAccordionSummary-root": {
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
        },
      }}
      defaultExpanded={false}
      disableGutters
      elevation={0}
      square
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="media-option-settings-content"
        id="media-option-settings-header"
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
          <Tooltip title="Allow participants to select one or multiple media options">
            <Typography>Multiple selection</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          mt={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "0%",
          }}
        >
          <Box sx={{ fontWeight: 500 }}>Multiple selection</Box>

          <Box mt={1}>
            <Controller
              name="multipleSelection"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={Boolean(field.value)}
                  disabled={!canEditQuestion}
                  onChange={(event) => {
                    if (!canEditQuestion) return;

                    const value = event.target.checked;

                    field.onChange(value);
                    markFormTouched();
                  }}
                  sx={{
                    cursor: canEditQuestion ? "pointer" : "not-allowed",
                    opacity: canEditQuestion ? 1 : 0.8,
                  }}
                />
              )}
            />
          </Box>
        </Box>

        {saveStatus !== "idle" && (
          <Box sx={{ mt: 0.5 }}>
            <SettingSaveStatus
              state={isSavingMediaOptions ? "saving" : saveStatus}
            />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
export default MediaOptionSettings;
