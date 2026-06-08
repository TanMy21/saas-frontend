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

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import {
  updateBinaryButtonTextNo,
  updateBinaryButtonTextYes,
} from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { usePermission } from "../../../../context/PermissionContext";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { BinaryResponseProps } from "../../../../utils/types";

import SettingSaveStatus from "./SettingSaveStatus";

const BinaryOptionsSettings = () => {
  const dispatch = useAppDispatch();
  const { canEditQuestion } = usePermission();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const [
    updateQuestionPreferenceUIConfig,
    { isLoading: isSavingBinaryOptions },
  ] = useUpdateQuestionPreferenceUIConfigMutation();

  const { questionID, questionPreferences } = question || {};

  const { buttonTextYes, buttonTextNo } = questionPreferences?.uiConfig || {
    buttonTextYes: "Yes",
    buttonTextNo: "No",
  };

  const { handleSubmit, control, reset } = useForm<BinaryResponseProps>({
    resolver: zodResolver(uiConfigPreferenceSchema),
    defaultValues: {
      buttonTextYes,
      buttonTextNo,
    },
  });

  const watchedValues = useWatch({ control });

  const [formTouched, setFormTouched] = useState(false);

  const [yesInputLength, setYesInputLength] = useState(
    buttonTextYes?.length ?? 0,
  );

  const [noInputLength, setNoInputLength] = useState(buttonTextNo?.length ?? 0);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "dirty" | "saving" | "saved" | "error"
  >("idle");

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Stores the last successfully saved option labels.
   * This avoids comparing against Redux live-preview values.
   */
  const lastSavedButtonsRef = useRef({
    buttonTextYes: buttonTextYes ?? "Yes",
    buttonTextNo: buttonTextNo ?? "No",
  });

  /**
   * Tracks the selected question.
   * This prevents Redux live-preview updates from resetting the form/status.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Saves binary button labels into uiConfig.
   * Existing uiConfig keys are preserved to avoid deleting other settings.
   */
  const onSubmit = async (data: BinaryResponseProps) => {
    if (!canEditQuestion || !questionID) return;

    try {
      const nextButtonTextYes = data.buttonTextYes?.trim() || "Yes";
      const nextButtonTextNo = data.buttonTextNo?.trim() || "No";

      /**
       * Compare against the last confirmed saved values,
       * not the Redux values that update while typing.
       */
      const hasNoChanges =
        nextButtonTextYes === lastSavedButtonsRef.current.buttonTextYes &&
        nextButtonTextNo === lastSavedButtonsRef.current.buttonTextNo;

      if (hasNoChanges) {
        setFormTouched(false);
        setSaveStatus("idle");
        return;
      }

      const uiConfig = {
        ...questionPreferences?.uiConfig,
        buttonTextYes: nextButtonTextYes,
        buttonTextNo: nextButtonTextNo,
      };

      setSaveStatus("saving");

      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig,
      }).unwrap();

      /**
       * After a successful backend save, update the saved baseline.
       */
      lastSavedButtonsRef.current = {
        buttonTextYes: nextButtonTextYes,
        buttonTextNo: nextButtonTextNo,
      };

      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Binary option text update error:", error);
      setFormTouched(false);
      setSaveStatus("error");
    }
  };

  /**
   * Marks this form as changed after a real user edit.
   * The save indicator remains hidden until this runs.
   */
  const markFormTouched = () => {
    if (!canEditQuestion) return;

    if (!formTouched) {
      setFormTouched(true);
    }

    setSaveStatus("dirty");
  };

  /**
   * Debounces binary option label saves.
   */
  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit, (errors) => {
        console.error("Binary option text validation error:", errors);
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
   * This prevents Redux live-preview updates from hiding the save indicator.
   */
  useEffect(() => {
    if (!questionID) return;

    if (activeQuestionIDRef.current === questionID) return;

    activeQuestionIDRef.current = questionID;

    const nextButtonTextYes = buttonTextYes ?? "Yes";
    const nextButtonTextNo = buttonTextNo ?? "No";

    lastSavedButtonsRef.current = {
      buttonTextYes: nextButtonTextYes,
      buttonTextNo: nextButtonTextNo,
    };

    reset({
      buttonTextYes: nextButtonTextYes,
      buttonTextNo: nextButtonTextNo,
    });

    setYesInputLength(nextButtonTextYes.length);
    setNoInputLength(nextButtonTextNo.length);
    setFormTouched(false);
    setSaveStatus("idle");
  }, [buttonTextYes, buttonTextNo, questionID, reset]);

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
        aria-controls="panel1-content"
        id="panel1-header"
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
          <Tooltip title="Set the text for the options">
            <Typography>Options</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            marginLeft: "2%",
            opacity: canEditQuestion ? 1 : 0.8,
            cursor: canEditQuestion ? "default" : "not-allowed",
          }}
        >
          <Box sx={{ fontWeight: 600, color: "#444D5C" }}>Button 1</Box>

          <Box mt={1}>
            <Controller
              name="buttonTextYes"
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  variant="standard"
                  disabled={!canEditQuestion}
                  sx={{
                    "& .MuiInputBase-input": {
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: canEditQuestion ? "default" : "not-allowed",
                      fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                      fontWeight: 500,
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
                      cursor: canEditQuestion ? "default" : "not-allowed",
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ color: "#6846E5", marginBottom: 0.5 }}
                      >
                        {`${yesInputLength}/24`}
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    if (!canEditQuestion) return;

                    const value = event.target.value;

                    if (value.length <= 24) {
                      field.onChange(value);
                      markFormTouched();

                      /**
                       * Updates Redux immediately so the canvas previews live.
                       */
                      dispatch(updateBinaryButtonTextYes(value));

                      setYesInputLength(value.length);
                    }
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            marginLeft: "2%",
          }}
        >
          <Box
            sx={{
              fontWeight: 500,
              color: "#3F3F46",
              opacity: canEditQuestion ? 1 : 0.8,
            }}
          >
            Button 2
          </Box>

          <Box mt={1}>
            <Controller
              name="buttonTextNo"
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  variant="standard"
                  disabled={!canEditQuestion}
                  sx={{
                    "& .MuiInputBase-input": {
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                      fontWeight: 500,
                      cursor: canEditQuestion ? "default" : "not-allowed",
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
                      cursor: canEditQuestion ? "default" : "not-allowed",
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
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    if (!canEditQuestion) return;

                    const value = event.target.value;

                    if (value.length <= 24) {
                      field.onChange(value);
                      markFormTouched();

                      /**
                       * Updates Redux immediately so the canvas previews live.
                       */
                      dispatch(updateBinaryButtonTextNo(value));

                      setNoInputLength(value.length);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ color: "#6846E5", marginBottom: 0.5 }}
                      >
                        {`${noInputLength}/24`}
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                />
              )}
            />
          </Box>
        </Box>

        {saveStatus !== "idle" && (
          <Box sx={{ mt: 0.5, px: 1 }}>
            <SettingSaveStatus
              state={isSavingBinaryOptions ? "saving" : saveStatus}
            />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
export default BinaryOptionsSettings;
