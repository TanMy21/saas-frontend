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

const NavigationButtonTextSettings = () => {
  const dispatch = useDispatch();
  const { canEditQuestion } = usePermission();

  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const { questionID, questionPreferences } = question || {};

  const [updateQuestionPreferenceUIConfig] =
    useUpdateQuestionPreferenceUIConfigMutation();

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

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Saves navigation button text into uiConfig.
   * Existing uiConfig keys must be preserved so settings like timers/display modes
   * are not accidentally removed.
   */
  const onSubmit = async (data: QuestionSetting) => {
    if (!canEditQuestion || !questionID) return;

    try {
      const nextButtonText = data.buttonText?.trim() || "Next";
      const currentButtonText =
        questionPreferences?.uiConfig?.buttonText ?? "Next";

      if (nextButtonText === currentButtonText) {
        setFormTouched(false);
        return;
      }

      const uiConfig = {
        ...questionPreferences?.uiConfig,
        buttonText: nextButtonText,
      };

      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig,
      }).unwrap();

      setFormTouched(false);
    } catch (error) {
      console.error("Navigation button text update error:", error);
    }
  };

  /**
   * Marks this form as touched only after a real user edit.
   */
  const markFormTouched = () => {
    if (!canEditQuestion) return;
    if (!formTouched) setFormTouched(true);
  };

  /**
   * Debounces save only after the user has edited the button text.
   * Important: do not set formTouched=true inside this effect.
   */
  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 2500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [watchedValues, formTouched, canEditQuestion, handleSubmit]);

  /**
   * Keeps form and character counter synced when selected question changes
   * or when fresh backend data arrives.
   */
  useEffect(() => {
    reset({
      buttonText,
    });

    setInputLength(buttonText.length);
    setFormTouched(false);
  }, [buttonText, questionID, reset]);

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
                      mb: 2,
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </form>
  );
};

export default NavigationButtonTextSettings;
