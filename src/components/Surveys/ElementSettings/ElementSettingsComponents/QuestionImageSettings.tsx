import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageIcon from "@mui/icons-material/Image";
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
import { useDispatch, useSelector } from "react-redux";

import { useToggleQuestionImageVisibilityMutation } from "../../../../app/slices/elementApiSlice";
import { toggleShowImage } from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import { questionImageSettingsSchema } from "../../../../utils/schema";
import { QuestionImage } from "../../../../utils/types";

import QuestionImageAltTxt from "./QuestionImageAltTxt";
import QuestionImageDimensions from "./QuestionImageDimensions";
import QuestionImageUpload from "./QuestionImageUpload";

const QuestionImageSettings = () => {
  const dispatch = useDispatch();
  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const [toggleQuestionImageVisibility] =
    useToggleQuestionImageVisibilityMutation();

  const { questionID, questionImage } = question || {};

  const { handleSubmit, control, reset } = useForm<QuestionImage>({
    resolver: zodResolver(questionImageSettingsSchema),
    defaultValues: {
      questionImage,
    },
  });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionImage) => {
    try {
      const { questionImage } = data;

      await toggleQuestionImageVisibility({
        questionID,
        questionImage,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const markFormTouched = () => {
    if (!formTouched) setFormTouched(true);
  };

  useEffect(() => {
    if (questionImage !== undefined) {
      reset({ questionImage });
    }
  }, [questionImage, reset]);

  useEffect(() => {
    if (!formTouched) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit)();
      setFormTouched(false);
    }, 2000);
  }, [watchedValues, formTouched, handleSubmit]);

  return (
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0E0E0",
        borderRadius: 0,
        boxShadow: "none",
      }}
      defaultExpanded={false}
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
          <ImageIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
          <Tooltip title="Set an image for the question">
            <Typography>Question image</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "96%",
            height: "80%",
            marginLeft: "4%",
            // border: "2px solid red",
          }}
        >
          <Box
            mt={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0%",
              width: "98%",
              height: "80%",
            }}
          >
            <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>Image</Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box mt={1}>
                <Controller
                  name="questionImage"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={(event) => {
                        const value = event.target.checked;
                        field.onChange(value);
                        markFormTouched();
                        dispatch(toggleShowImage(value));
                      }}
                    />
                  )}
                />
              </Box>
            </form>
          </Box>
          {questionImage && (
            <>
              <QuestionImageUpload questionID={questionID!} />
              <QuestionImageAltTxt />
              <QuestionImageDimensions />
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default QuestionImageSettings;
