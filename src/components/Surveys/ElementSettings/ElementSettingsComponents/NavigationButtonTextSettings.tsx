import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { useDispatch, useSelector } from "react-redux";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import { updateUIButtonText } from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import { usePermission } from "../../../../context/PermissionContext";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { QuestionSetting } from "../../../../utils/types";

import SettingSaveStatus from "./SettingSaveStatus";

const NavigationButtonTextSettings = () => {
  const dispatch = useDispatch();
  const { canEditQuestion } = usePermission();

  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const { questionID, questionPreferences } = question || {};

  const [
    updateQuestionPreferenceUIConfig,
    { isLoading: isSavingNavigationButtonText },
  ] = useUpdateQuestionPreferenceUIConfigMutation();

  const buttonText = questionPreferences?.uiConfig?.buttonText ?? "Next";

  const { handleSubmit, control, reset } = useForm<QuestionSetting>({
    resolver: zodResolver(uiConfigPreferenceSchema),
    defaultValues: {
      buttonText,
    },
  });

  const watchedValues = useWatch({ control });

  const [formTouched, setFormTouched] = useState(false);
  const [inputLength, setInputLength] = useState(buttonText.length);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "dirty" | "saving" | "saved" | "error"
  >("idle");

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Stores the last successfully saved backend value.
   * This avoids comparing against Redux live-preview value,
   * because Redux is updated immediately while typing.
   */
  const lastSavedButtonTextRef = useRef(buttonText);

  /**
   * Tracks the currently selected question.
   * We only reset the form when the selected question changes,
   * not every time Redux preview text changes while typing.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Saves navigation button text into uiConfig.
   * Existing uiConfig keys are preserved so settings like timers/display modes
   * are not accidentally removed.
   */
  const onSubmit = async (data: QuestionSetting) => {
    if (!canEditQuestion || !questionID) return;

    try {
      const nextButtonText = data.buttonText?.trim() || "Next";

      /**
       * Compare against the last confirmed saved value,
       * not the Redux preview value.
       */
      if (nextButtonText === lastSavedButtonTextRef.current) {
        setFormTouched(false);
        setSaveStatus("idle");
        return;
      }

      const uiConfig = {
        ...questionPreferences?.uiConfig,
        buttonText: nextButtonText,
      };

      setSaveStatus("saving");

      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig,
      }).unwrap();

      /**
       * After successful save, update the saved baseline.
       */
      lastSavedButtonTextRef.current = nextButtonText;

      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Navigation button text update error:", error);
      setFormTouched(false);
      setSaveStatus("error");
    }
  };

  /**
   * Marks this form as touched only after a real user edit.
   * Save status appears only after the user changes something.
   */
  const markFormTouched = () => {
    if (!canEditQuestion) return;

    if (!formTouched) {
      setFormTouched(true);
    }

    setSaveStatus("dirty");
  };

  /**
   * Debounces save only after the user has edited the button text.
   */
  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit, (errors) => {
        console.error("Navigation button text validation error:", errors);
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
   * This prevents Redux live-preview updates from resetting saveStatus to idle.
   */
  useEffect(() => {
    if (!questionID) return;

    if (activeQuestionIDRef.current === questionID) return;

    activeQuestionIDRef.current = questionID;
    lastSavedButtonTextRef.current = buttonText;

    reset({
      buttonText,
    });

    setInputLength(buttonText.length);
    setFormTouched(false);
    setSaveStatus("idle");
  }, [buttonText, questionID, reset]);

  /**
   * Clears pending debounce when the component unmounts.
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Accordion
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E0E0E0",
          borderRadius: 0,
          boxShadow: "none",
        }}
        defaultExpanded={false}
        disableGutters
        elevation={0}
        square
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="navigation-button-settings-content"
          id="navigation-button-settings-header"
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
            <Tooltip title="Set the text on the navigation button">
              <Typography>Navigation button</Typography>
            </Tooltip>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ px: { md: 1, xl: 1 }, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "96%",
              height: "100%",
              marginLeft: "2%",
              opacity: canEditQuestion ? 1 : 0.8,
              pointerEvents: canEditQuestion ? "auto" : "none",
            }}
          >
            <Box sx={{ marginTop: "2%", fontWeight: 500, color: "#3F3F46" }}>
              Button
            </Box>

            <Box mt={1}>
              <Controller
                name="buttonText"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="text"
                    variant="standard"
                    disabled={!canEditQuestion}
                    placeholder="Next"
                    fullWidth
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      if (!canEditQuestion) return;

                      const value = event.target.value;

                      if (value.length <= 24) {
                        field.onChange(value);
                        markFormTouched();

                        /**
                         * Updates Redux immediately so the canvas button text previews live.
                         */
                        dispatch(updateUIButtonText(value));

                        setInputLength(value.length);
                      }
                    }}
                    InputProps={{
                      disableUnderline: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box
                            sx={{
                              fontSize: "12px",
                              color: "#9E9E9E",
                              pr: 1,
                            }}
                          >
                            {inputLength}/24
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        lineHeight: "1.5",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                        fontWeight: 500,
                        cursor: canEditQuestion ? "text" : "not-allowed",
                      },
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        height: "42px",
                        fontSize: "15px",
                        backgroundColor: "#F3F4F6",
                        fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                        fontWeight: 500,
                        color: "#1F2937",
                        px: 1.5,
                        cursor: canEditQuestion ? "text" : "not-allowed",
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#E5E7EB",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#E0E7FF",
                        },
                      },
                      "& input::placeholder": {
                        color: "#9CA3AF",
                        opacity: 1,
                        fontWeight: 400,
                      },
                      mb: saveStatus === "idle" ? 2 : 1,
                    }}
                  />
                )}
              />
            </Box>

            {saveStatus !== "idle" && (
              <Box sx={{ mt: 0.5 }}>
                <SettingSaveStatus
                  state={
                    isSavingNavigationButtonText ? "saving" : saveStatus
                  }
                />
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </form>
  );
};

export default NavigationButtonTextSettings;
