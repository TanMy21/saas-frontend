import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Slider, TextField, Typography } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { useUpdateQuestionImageDimensionsMutation } from "../../../../app/slices/elementApiSlice";
import {
  setImageHeight,
  setImageWidth,
} from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import { questionImageSettingsSchema } from "../../../../utils/schema";
import { QuestionImageDimensionsFormProps } from "../../../../utils/types";

const QuestionImageDimensions = () => {
  const dispatch = useDispatch();
  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const [updateQuestionImageDimensions] =
    useUpdateQuestionImageDimensionsMutation();

  const { questionID, questionImageWidth, questionImageHeight } =
    question || {};

  const { handleSubmit, control, reset } =
    useForm<QuestionImageDimensionsFormProps>({
      resolver: zodResolver(questionImageSettingsSchema),
      defaultValues: {
        questionImageHeight: questionImageHeight || 250,
        questionImageWidth: questionImageWidth || 200,
      },
    });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionImageDimensionsFormProps) => {
    try {
      const { questionImageHeight, questionImageWidth } = data;

      await updateQuestionImageDimensions({
        questionID,
        questionImageWidth,
        questionImageHeight,
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
    reset({
      questionImageWidth,
      questionImageHeight,
    });
  }, [questionImageWidth, questionImageHeight, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ mb: 2 }}>
        {/* Image Width */}
        <Box sx={{ mb: 1, ml: 1, width: "98%" }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: "bold", color: "#444D5C" }}
          >
            Image Width
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "96%",
              ml: 1,
              alignItems: "center",
              gap: 2,
              //   border: "1px solid red",
            }}
          >
            <Controller
              name="questionImageWidth"
              control={control}
              render={({ field }) => (
                <>
                  <Slider
                    min={275}
                    max={825}
                    value={field.value}
                    onChange={(_, val) => {
                      const numericValue = Array.isArray(val) ? val[0] : val;
                      field.onChange(numericValue);
                      markFormTouched();
                      dispatch(setImageWidth(numericValue));
                    }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="number"
                    value={field.value}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      field.onChange(value);
                      markFormTouched();
                      dispatch(setImageWidth(value));
                    }}
                    inputProps={{ min: 275, max: 825 }}
                    sx={{
                      width: 76,
                      "& .MuiInputBase-root": {
                        width: "100%",
                        borderRadius: 2,
                        backgroundColor: "#F9FAFB",
                        height: "40px",
                        fontSize: "16px",
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    px
                  </Typography>
                </>
              )}
            />
          </Box>
        </Box>
        {/* Image Height */}
        <Box sx={{ mb: 1, ml: 1, width: "98%" }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: "bold", color: "#444D5C" }}
          >
            Image Height
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "96%",
              ml: 1,
              alignItems: "center",
              gap: 2,
              //   border: "1px solid red",
            }}
          >
            <Controller
              name="questionImageHeight"
              control={control}
              render={({ field }) => (
                <>
                  <Slider
                    min={120}
                    max={240}
                    value={field.value}
                    onChange={(_, val) => {
                      const numericValue = Array.isArray(val) ? val[0] : val;
                      field.onChange(numericValue);
                      markFormTouched();
                      dispatch(setImageHeight(numericValue));
                    }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="number"
                    value={field.value}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      field.onChange(value);
                      markFormTouched();
                      dispatch(setImageHeight(value));
                    }}
                    inputProps={{ min: 120, max: 240 }}
                    sx={{
                      width: 76,
                      "& .MuiInputBase-root": {
                        width: "100%",
                        borderRadius: 2,
                        backgroundColor: "#F9FAFB",
                        height: "40px",
                        fontSize: "16px",
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    px
                  </Typography>
                </>
              )}
            />
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default QuestionImageDimensions;
