import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useUpdateScreenElementsMutation } from "../../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../../app/slices/elementSlice";
import { updateElementField } from "../../../../app/slices/surveySlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import {
  htmlToPlainText,
  rewriteHtmlTextPreserveInlineTags,
} from "../../../../utils/richTextUtils";
import { textAndDescriptionSettingsSchema } from "../../../../utils/schema";
import { QuestionSetting } from "../../../../utils/types";

import { RichTextField } from "./RichTextField";

const QuestionTextandDescriptionSettings = () => {
  const dispatch = useAppDispatch();
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion
  );
  const { questionID, text, description } = question || {};
  const [updateScreenElements] = useUpdateScreenElementsMutation();

  const { handleSubmit, control, reset } = useForm<QuestionSetting>({
    resolver: zodResolver(textAndDescriptionSettingsSchema),
    defaultValues: {
      questionText: text,
      questionDescription: description,
    },
  });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const { questionText, questionDescription } = data;

      const config = {};
      await updateScreenElements({
        questionID,
        text: questionText,
        description: questionDescription,
        config,
      }).unwrap();
      setFormTouched(false);
    } catch (error) {
      console.error(error);
    }
  };

  const markFormTouched = () => {
    if (!formTouched) setFormTouched(true);
  };

  useEffect(() => {
    if (!formTouched) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit)();
      setFormTouched(false);
    }, 2500);
  }, [watchedValues, formTouched, handleSubmit]);

  useEffect(() => {
    if (text !== undefined && description !== undefined) {
      reset({
        questionText: text,
        questionDescription: description,
      });
    }
  }, [questionID, text, description, reset]);

  return (
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0E0E0",
        boxShadow: "none",
      }}
      disableGutters
      elevation={0}
      square
      defaultExpanded
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
            fontWeight: 600,
            // pl: "4%",
            color: "#453F46",
          }}
        >
          <HelpOutlineIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
          <Tooltip title="Set the question text and description for your question">
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
            // border: "2px solid red",
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
                  value={htmlToPlainText(field.value)}
                  placeholder="Enter your question"
                  onChange={(nextPlain) => {
                    const mergedHtml = rewriteHtmlTextPreserveInlineTags(
                      field.value ?? "",
                      nextPlain
                    );
                    field.onChange(mergedHtml); // RHF value = HTML
                    markFormTouched();
                    dispatch(
                      updateQuestionField({ key: "text", value: mergedHtml })
                    );
                    if (questionID) {
                      dispatch(
                        updateElementField({
                          questionID,
                          key: "text",
                          value: mergedHtml,
                        })
                      );
                    }
                  }}
                  height={42}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </Box>
          <Box
            sx={{ marginTop: "2%", fontWeight: 500, color: "#3F3F46", mb: 1 }}
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
                  value={htmlToPlainText(field.value)}
                  placeholder="Description (optional)"
                  onChange={(nextPlain) => {
                    const mergedHtml = rewriteHtmlTextPreserveInlineTags(
                      field.value ?? "",
                      nextPlain
                    );
                    field.onChange(mergedHtml);
                    markFormTouched();
                    dispatch(
                      updateQuestionField({
                        key: "description",
                        value: mergedHtml,
                      })
                    );
                    if (questionID) {
                      dispatch(
                        updateElementField({
                          questionID,
                          key: "description",
                          value: mergedHtml,
                        })
                      );
                    }
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default QuestionTextandDescriptionSettings;
