import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, TextField, Typography } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { useUpdateQuestionImageAltTxtMutation } from "../../../../app/slices/elementApiSlice";
import { setImageAltText } from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import { questionImageSettingsSchema } from "../../../../utils/schema";
import { QuestionImage } from "../../../../utils/types";

const QuestionImageAltTxt = () => {
  const [updateQuestionImageAltTxt] = useUpdateQuestionImageAltTxtMutation();

  const dispatch = useDispatch();
  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );
  const { questionID, questionImageAltTxt } = question || {};

  const { handleSubmit, control, reset } = useForm<QuestionImage>({
    resolver: zodResolver(questionImageSettingsSchema),
    defaultValues: {
      questionImageAltTxt,
    },
  });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionImage) => {
    try {
      const { questionImageAltTxt } = data;

      await updateQuestionImageAltTxt({
        questionID,
        questionImageAltTxt,
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
    if (questionImageAltTxt !== undefined) {
      reset({
        questionImageAltTxt,
      });
    }
  }, [questionImageAltTxt, reset]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#3F3F46" }}>
        Image alt text
      </Typography>
      <Controller
        name="questionImageAltTxt"
        control={control}
        render={({ field }) => (
          <TextField
            size="small"
            fullWidth
            {...field}
            onChange={(event) => {
              const value = event.target.value;
              field.onChange(value);
              markFormTouched();
              dispatch(setImageAltText(value));
            }}
            placeholder="Describe the image for screen readers"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "0.875rem",
              },
            }}
            InputLabelProps={{ shrink: false }}
            sx={{
              "& .MuiInputBase-input": {
                lineHeight: "1.5",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
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
  );
};

export default QuestionImageAltTxt;
