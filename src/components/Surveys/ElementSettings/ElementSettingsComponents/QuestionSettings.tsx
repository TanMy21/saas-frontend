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
import { Controller, useForm } from "react-hook-form";

import { useUpdateQuestionBasicSettingsMutation } from "../../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../../app/slices/elementSlice";
import { updateElementField } from "../../../../app/slices/surveySlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { usePermission } from "../../../../context/PermissionContext";
import {
  htmlToPlainText,
  rewriteHtmlTextPreserveInlineTags,
  sanitizeRichTextHtml,
} from "../../../../utils/richTextUtils";
import { questionBasicSettingsSchema } from "../../../../utils/schema";
import { showToast } from "../../../../utils/showToast";
import { QuestionSetting } from "../../../../utils/types";

import { RichTextField } from "./RichTextField";
import SettingSaveStatus from "./SettingSaveStatus";

const QuestionContentSettings = () => {
  const dispatch = useAppDispatch();
  const { canEditQuestion } = usePermission();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = question?.questionID;

  const [updateQuestionBasicSettings, { isLoading: isSavingBasicSettings }] =
    useUpdateQuestionBasicSettingsMutation();

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "dirty" | "saving" | "saved" | "error"
  >("idle");

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Tracks the currently loaded question.
   * We hydrate the form only when the selected question changes.
   * This prevents switch bounce-back from stale Redux/refetch updates.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Stores the last successfully saved basic settings.
   * This prevents Redux live-preview updates from being treated as saved backend state.
   */
  const lastSavedBasicSettingsRef = useRef({
    questionText: "",
    questionDescription: "",
    showQuestion: true,
    required: false,
  });

  const { control, reset, getValues, setValue } = useForm<QuestionSetting>({
    resolver: zodResolver(questionBasicSettingsSchema),
    defaultValues: {
      questionText: "",
      questionDescription: "",
      showQuestion: true,
      required: false,
    },
  });

  const [localShowQuestion, setLocalShowQuestion] = useState(true);
  const [localRequired, setLocalRequired] = useState(false);

  /**
   * Hydrates text, description, showQuestion, and required when a new question is selected.
   * This fixes empty inputs on initial load and keeps the save indicator hidden initially.
   */
  useEffect(() => {
    if (!questionID || !question) return;

    if (activeQuestionIDRef.current === questionID) return;

    activeQuestionIDRef.current = questionID;

    const nextText = question.text ?? "";
    const nextDescription = question.description ?? "";
    const nextShowQuestion = question.showQuestion ?? true;
    const nextRequired = question.required ?? false;

    lastSavedBasicSettingsRef.current = {
      questionText: nextText,
      questionDescription: nextDescription,
      showQuestion: nextShowQuestion,
      required: nextRequired,
    };

    reset({
      questionText: nextText,
      questionDescription: nextDescription,
      showQuestion: nextShowQuestion,
      required: nextRequired,
    });

    setLocalShowQuestion(nextShowQuestion);
    setLocalRequired(nextRequired);
    setSaveStatus("idle");
  }, [questionID, question, reset]);

  /**
   * Checks whether the next payload is different from the last confirmed saved payload.
   * This avoids showing saving/saved when the user returns to the original value.
   */
  const hasActualBasicSettingsChange = (payload: QuestionSetting) => {
    const lastSaved = lastSavedBasicSettingsRef.current;

    return (
      payload.questionText !== lastSaved.questionText ||
      payload.questionDescription !== lastSaved.questionDescription ||
      payload.showQuestion !== lastSaved.showQuestion ||
      payload.required !== lastSaved.required
    );
  };

  /**
   * Sends the full basic settings payload through one endpoint.
   * Text/description are always sent from RHF values, so backend validation
   * does not fail when only a switch changes.
   */
  const saveQuestionBasicSettings = async (
    nextValues?: Partial<QuestionSetting>,
  ) => {
    if (!canEditQuestion || !questionID) return;

    const currentValues = getValues();

    const payload = {
      questionText:
        nextValues?.questionText ??
        currentValues.questionText ??
        question?.text ??
        "",

      questionDescription:
        nextValues?.questionDescription ??
        currentValues.questionDescription ??
        question?.description ??
        "",

      showQuestion:
        nextValues?.showQuestion ??
        currentValues.showQuestion ??
        localShowQuestion,

      required: nextValues?.required ?? currentValues.required ?? localRequired,
    };

    if (!payload.questionText?.trim()) {
      showToast.error("Question text cannot be empty.");
      setSaveStatus("error");
      return;
    }

    /**
     * If there is no real change compared to the last saved backend state,
     * hide the indicator because nothing needs to be saved.
     */
    if (!hasActualBasicSettingsChange(payload)) {
      setSaveStatus("idle");
      return;
    }

    try {
      setSaveStatus("saving");

      const updatedQuestion = await updateQuestionBasicSettings({
        questionID,
        text: payload.questionText,
        description: payload.questionDescription,
        showQuestion: payload.showQuestion,
        required: payload.required,
      }).unwrap();

      /**
       * Sync selected question from backend response for text/description.
       */
      dispatch(
        updateQuestionField({
          key: "text",
          value: updatedQuestion.text,
        }),
      );

      dispatch(
        updateQuestionField({
          key: "description",
          value: updatedQuestion.description,
        }),
      );

      /**
       * For booleans, use local payload value to avoid bounce-back
       * from any stale backend/refetch response.
       */
      dispatch(
        updateQuestionField({
          key: "showQuestion",
          value: payload.showQuestion,
        }),
      );

      dispatch(
        updateQuestionField({
          key: "required",
          value: payload.required,
        }),
      );

      dispatch(
        updateElementField({
          questionID,
          key: "text",
          value: updatedQuestion.text,
        }),
      );

      dispatch(
        updateElementField({
          questionID,
          key: "description",
          value: updatedQuestion.description,
        }),
      );

      dispatch(
        updateElementField({
          questionID,
          key: "showQuestion",
          value: payload.showQuestion,
        }),
      );

      dispatch(
        updateElementField({
          questionID,
          key: "required",
          value: payload.required,
        }),
      );

      /**
       * Update saved baseline only after backend confirms the save.
       */
      lastSavedBasicSettingsRef.current = {
        questionText: updatedQuestion.text,
        questionDescription: updatedQuestion.description,
        showQuestion: payload.showQuestion,
        required: payload.required,
      };

      setSaveStatus("saved");
    } catch (error) {
      console.error("Question basic settings update error:", error);
      setSaveStatus("error");
      showToast.error("Failed to update question settings.");
    }
  };

  /**
   * Debounces text/description saves.
   * The indicator appears only when there is a real difference from the saved baseline.
   */
  const scheduleTextSave = () => {
    if (!canEditQuestion) return;

    const currentValues = getValues();

    const payload = {
      questionText: currentValues.questionText ?? "",
      questionDescription: currentValues.questionDescription ?? "",
      showQuestion: currentValues.showQuestion ?? localShowQuestion,
      required: currentValues.required ?? localRequired,
    };

    /**
     * If the user returns the text/description to the saved value,
     * hide the status instead of showing dirty/saved unnecessarily.
     */
    if (!hasActualBasicSettingsChange(payload)) {
      setSaveStatus("idle");

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      return;
    }

    setSaveStatus("dirty");

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      saveQuestionBasicSettings();
    }, 2500);
  };

  /**
   * Updates question text locally and schedules save.
   */
  const handleQuestionTextChange = (
    nextPlain: string,
    fieldValue: string | undefined,
    onFieldChange: (value: string) => void,
  ) => {
    const mergedHtml = rewriteHtmlTextPreserveInlineTags(
      fieldValue ?? "",
      nextPlain,
    );

    const safeHtml = sanitizeRichTextHtml(mergedHtml);

    onFieldChange(safeHtml);

    dispatch(
      updateQuestionField({
        key: "text",
        value: safeHtml,
      }),
    );

    if (questionID) {
      dispatch(
        updateElementField({
          questionID,
          key: "text",
          value: safeHtml,
        }),
      );
    }

    scheduleTextSave();
  };

  /**
   * Updates description locally and schedules save.
   */
  const handleQuestionDescriptionChange = (
    nextPlain: string,
    fieldValue: string | undefined,
    onFieldChange: (value: string) => void,
  ) => {
    const mergedHtml = rewriteHtmlTextPreserveInlineTags(
      fieldValue ?? "",
      nextPlain,
    );

    const safeHtml = sanitizeRichTextHtml(mergedHtml);

    onFieldChange(safeHtml);

    dispatch(
      updateQuestionField({
        key: "description",
        value: safeHtml,
      }),
    );

    if (questionID) {
      dispatch(
        updateElementField({
          questionID,
          key: "description",
          value: safeHtml,
        }),
      );
    }

    scheduleTextSave();
  };

  /**
   * Updates showQuestion locally and saves only if the value actually changed.
   */
  const handleShowQuestionChange = async (value: boolean) => {
    if (!canEditQuestion || !questionID) return;

    setLocalShowQuestion(value);

    setValue("showQuestion", value, {
      shouldDirty: true,
      shouldTouch: true,
    });

    dispatch(
      updateQuestionField({
        key: "showQuestion",
        value,
      }),
    );

    dispatch(
      updateElementField({
        questionID,
        key: "showQuestion",
        value,
      }),
    );

    const currentValues = getValues();

    const payload = {
      questionText: currentValues.questionText ?? question?.text ?? "",
      questionDescription:
        currentValues.questionDescription ?? question?.description ?? "",
      showQuestion: value,
      required: localRequired,
    };

    if (!hasActualBasicSettingsChange(payload)) {
      setSaveStatus("idle");
      return;
    }

    setSaveStatus("dirty");

    await saveQuestionBasicSettings({
      showQuestion: value,
      required: localRequired,
    });
  };

  /**
   * Updates required locally and saves only if the value actually changed.
   */
  const handleRequiredChange = async (value: boolean) => {
    if (!canEditQuestion || !questionID) return;

    setLocalRequired(value);

    setValue("required", value, {
      shouldDirty: true,
      shouldTouch: true,
    });

    dispatch(
      updateQuestionField({
        key: "required",
        value,
      }),
    );

    dispatch(
      updateElementField({
        questionID,
        key: "required",
        value,
      }),
    );

    const currentValues = getValues();

    const payload = {
      questionText: currentValues.questionText ?? question?.text ?? "",
      questionDescription:
        currentValues.questionDescription ?? question?.description ?? "",
      showQuestion: localShowQuestion,
      required: value,
    };

    if (!hasActualBasicSettingsChange(payload)) {
      setSaveStatus("idle");
      return;
    }

    setSaveStatus("dirty");

    await saveQuestionBasicSettings({
      showQuestion: localShowQuestion,
      required: value,
    });
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
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E0E0E0",
        boxShadow: "none",
        "&:before": { display: "none" },
      }}
      disableGutters
      elevation={0}
      square
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="question-content-settings"
        id="question-content-settings-header"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontWeight: 600,
            color: "#453F46",
          }}
        >
          <Tooltip title="Set the question text, description, visibility, and response rules">
            <Typography>Question</Typography>
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
          }}
        >
          <Box sx={{ fontWeight: 500, color: "#3F3F46", mb: 1 }}>Text</Box>

          <Box mt={1}>
            <Controller
              name="questionText"
              control={control}
              render={({ field }) => (
                <RichTextField
                  key={questionID}
                  id="settings-question-text"
                  value={htmlToPlainText(field.value ?? "")}
                  placeholder="Enter your question"
                  readOnly={!canEditQuestion}
                  onChange={(nextPlain) => {
                    handleQuestionTextChange(
                      nextPlain,
                      field.value,
                      field.onChange,
                    );
                  }}
                  height={42}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </Box>

          <Box
            sx={{
              marginTop: "2%",
              fontWeight: 500,
              color: "#3F3F46",
              mb: 1,
            }}
          >
            Description
          </Box>

          <Box mt={1}>
            <Controller
              name="questionDescription"
              control={control}
              render={({ field }) => (
                <RichTextField
                  key={`${questionID}-desc`}
                  id="settings-question-desc"
                  value={htmlToPlainText(field.value ?? "")}
                  placeholder="Description (optional)"
                  readOnly={!canEditQuestion}
                  onChange={(nextPlain) => {
                    handleQuestionDescriptionChange(
                      nextPlain,
                      field.value,
                      field.onChange,
                    );
                  }}
                  height="auto"
                  sx={{
                    mb: 2,
                    alignItems: "flex-start",
                    py: 0.75,
                    minHeight: 42,
                  }}
                />
              )}
            />
          </Box>

          <Box
            sx={{
              mt: 1,
              pt: 1.5,
              borderTop: "1px solid #E5E7EB",
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "98%",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 500, color: "#3F3F46" }}>
                  Show question
                </Typography>
              </Box>

              <Switch
                checked={localShowQuestion}
                disabled={!canEditQuestion || isSavingBasicSettings}
                onChange={(event) => {
                  handleShowQuestionChange(event.target.checked);
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "98%",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 500, color: "#3F3F46" }}>
                  Response required
                </Typography>
              </Box>

              <Switch
                checked={localRequired}
                disabled={!canEditQuestion || isSavingBasicSettings}
                onChange={(event) => {
                  handleRequiredChange(event.target.checked);
                }}
              />
            </Box>

            {saveStatus !== "idle" && (
              <SettingSaveStatus
                state={isSavingBasicSettings ? "saving" : saveStatus}
              />
            )}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
export default QuestionContentSettings;
