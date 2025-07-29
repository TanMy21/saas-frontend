import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import { RootState } from "../../../../app/store";
import { useAppSelector } from "../../../../app/typedReduxHooks";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { QuestionUIConfig } from "../../../../utils/types";

const NumberInputRangeSettings = () => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const [updateQuestionPreferenceUIConfig] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const { questionID, questionPreferences } = question || {};

  const { minValue, maxValue } = questionPreferences?.uiConfig || {
    minValue: 0,
    maxValue: 0,
  };

  const { handleSubmit, control, reset } = useForm<QuestionUIConfig>({
    resolver: zodResolver(uiConfigPreferenceSchema),
    defaultValues: {
      minValue: questionPreferences?.uiConfig?.minValue,
      maxValue: questionPreferences?.uiConfig?.maxValue,
    },
  });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionUIConfig) => {
    try {
      const { minValue, maxValue } = data;

      const uiConfig = { minValue, maxValue };
      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig,
      });
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
    if (minValue !== undefined && maxValue !== undefined) {
      reset({
        minValue: minValue,
        maxValue: maxValue,
      });
    }
  }, [minValue, maxValue, reset]);

  return (
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0E0E0",
        borderBottom: "1px solid #E5E7EB",
        borderRadius: 0,
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
            fontWeight: 500,
            color: "#453F46",
          }}
        >
          <LinearScaleIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
          <Tooltip title="Set the input range for the number input">
            <Typography>Input range</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { md: 1, xl: 1 }, pb: 2 }}>
        <Box
          mt={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "96%",
            marginLeft: "1%",
            // border: "2px solid red",
          }}
        >
          {/* min value */}
          <Box
            mt={1}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "column", xl: "row" },
              justifyContent: "flex-start",
              alignItems: { xs: "flex-start", md: "flex-start", xl: "center" },
              width: "100%",
              miHeight: "48px",
              gap: { md: 1 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: { xs: "100%", xl: "60%" },
                height: "100%",
                fontWeight: 500,
                fontSize: "16px",
                color: "#3F3F46",
                mb: { md: 1 },
              }}
            >
              Min number
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
              }}
            >
              <Controller
                name="minValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="number"
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
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
                        width: { md: "100%", xl: "72%" },
                        height: "100%",
                        fontSize: "15px",
                        backgroundColor: "#F3F4F6",
                        fontWeight: 600,
                        color: "#1F2937",
                        px: 1.5,
                        marginLeft: { md: "0%", xl: "16%" },
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
                    }}
                    {...field}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      field.onChange(value);
                      markFormTouched();
                    }}
                  />
                )}
              />
            </Box>
          </Box>
          {/* max value */}
          <Box
            mt={1}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "column", xl: "row" },
              justifyContent: "flex-start",
              alignItems: { xs: "flex-start", md: "flex-start", xl: "center" },
              minHeight: "48px",
              width: "100%",
              gap: { md: 1 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: { xs: "100%", xl: "60%" },
                height: "100%",
                fontWeight: 500,
                fontSize: "16px",
                color: "#3F3F46",
                mb: { md: 1 },
              }}
            >
              Max number
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
                mb: { md: 0.5 },
                ml: { md: 0.5 },
              }}
            >
              <Controller
                name="maxValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="number"
                    variant="standard"
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                    }}
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
                        width: { md: "100%", xl: "72%" },
                        height: "100%",
                        marginLeft: { md: "0%", xl: "16%" },
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
                    }}
                    {...field}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      field.onChange(value);
                      markFormTouched();
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default NumberInputRangeSettings;
