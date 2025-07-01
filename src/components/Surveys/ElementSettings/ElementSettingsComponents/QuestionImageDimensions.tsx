import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  InputAdornment,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
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
        questionImageHeight: questionImageHeight ?? 250,
        questionImageWidth: questionImageWidth ?? 200,
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
        <Box sx={{ mb: 1, width: "98%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: "bold",
                color: "#444D5C",
              }}
            >
              Image width
            </Typography>
            <Controller
              name="questionImageWidth"
              control={control}
              render={({ field }) => (
                <TextField
                  type="number"
                  variant="standard"
                  value={field.value}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(value);
                    markFormTouched();
                    dispatch(dispatch(setImageWidth(value)));
                  }}
                  inputProps={{ min: 275, max: 825 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ color: "#6846E5", marginBottom: 0.5 }}
                      >
                        px
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  sx={{
                    width: { md: 120, xl: 92 },
                    "& .MuiInputBase-root": {
                      borderRadius: 1,
                      backgroundColor: "#EEF2FF",
                      height: "36px",
                      width: { md: "100%" },
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#6846E5",
                      border: "none",
                      boxShadow: "none",
                      px: 1.25,
                    },
                  }}
                />
              )}
            />
          </Box>
          {/* Slider */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              ml: 2,
              width: { md: "68%", xl: "80%" },
            }}
          >
            <Controller
              name="questionImageWidth"
              control={control}
              render={({ field }) => (
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
              )}
            />
          </Box>
        </Box>
        {/* Image Height */}
        <Box sx={{ mb: 1, width: "98%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: "bold",
                color: "#444D5C",
              }}
            >
              Image height
            </Typography>
            <Controller
              name="questionImageHeight"
              control={control}
              render={({ field }) => (
                <TextField
                  type="number"
                  variant="standard"
                  value={field.value}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(value);
                    markFormTouched();
                    dispatch(setImageHeight(value));
                  }}
                  inputProps={{ min: 120, max: 240 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ color: "#6846E5", marginBottom: 0.5 }}
                      >
                        px
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  sx={{
                    width: { md: 120, xl: 92 },
                    "& .MuiInputBase-root": {
                      borderRadius: 1,
                      backgroundColor: "#EEF2FF",
                      height: "36px",
                      width: { md: "100%" },
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#6846E5",
                      border: "none",
                      boxShadow: "none",
                      px: 1.25,
                    },
                  }}
                />
              )}
            />
          </Box>
          {/* Slider below, syncs as before */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              ml: 2,
              width: { md: "68%", xl: "80%" },
            }}
          >
            <Controller
              name="questionImageHeight"
              control={control}
              render={({ field }) => (
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
              )}
            />
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default QuestionImageDimensions;
