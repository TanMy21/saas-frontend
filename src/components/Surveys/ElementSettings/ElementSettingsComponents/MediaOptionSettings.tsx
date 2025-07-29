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
import { BiSolidSelectMultiple } from "react-icons/bi";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import { RootState } from "../../../../app/store";
import { useAppSelector } from "../../../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../../../context/BuilderRefetchCanvas";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { QuestionUIConfig } from "../../../../utils/types";

const MediaOptionSettings = () => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion
  );
  const refetchCanvas = useSurveyCanvasRefetch();
  const [updateQuestionPreferenceUIConfig] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const { questionID, questionPreferences } = question || {};

  const { multipleSelection } = questionPreferences?.uiConfig || {
    multipleSelection: false,
  };

  const { handleSubmit, control, reset } = useForm<QuestionUIConfig>({
    resolver: zodResolver(uiConfigPreferenceSchema),
    defaultValues: {
      multipleSelection:
        questionPreferences?.uiConfig?.multipleSelection || false,
    },
  });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionUIConfig) => {
    try {
      const { multipleSelection } = data;

      const uiConfig = { multipleSelection };
      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig,
      });
      refetchCanvas();
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
    if (multipleSelection !== undefined) {
      reset({
        multipleSelection: multipleSelection,
      });
    }
  }, [multipleSelection, reset]);
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
            alignItems: "center",
            gap: 2,
            fontWeight: 500,
            color: "#453F46",
          }}
        >
          <BiSolidSelectMultiple style={{ color: "#752FEC" }} />
          <Tooltip title="Typography settings for question text and description">
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
                  checked={field.value}
                  onChange={(event) => {
                    const value = event.target.checked;
                    field.onChange(value);
                    markFormTouched();
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

export default MediaOptionSettings;
