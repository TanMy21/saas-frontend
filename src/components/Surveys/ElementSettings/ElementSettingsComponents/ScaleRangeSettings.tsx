import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import {
  updateMaxValue,
  updateMinValue,
} from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { QuestionUIConfig } from "../../../../utils/types";

const ScaleRangeSettings = () => {
  const dispatch = useAppDispatch();
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
            // pl: "4%",
            color: "#453F46",
          }}
        >
          <LinearScaleIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
          <Tooltip title="Set the range for the slider">
            <Typography>Slider range</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8%",
          }}
        >
          <Box>
            <Controller
              name="minValue"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  variant="standard"
                  fullWidth
                  displayEmpty
                  disableUnderline
                  sx={{
                    borderRadius: "8px",
                    height: "42px",
                    backgroundColor: "#F3F4F6",
                    fontSize: "15px",
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
                    "& .MuiSelect-icon": {
                      color: "#4338CA",
                    },
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    mb: 2,
                  }}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    field.onChange(value);
                    dispatch(updateMinValue(value));
                    markFormTouched();
                  }}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Box>
          <Box
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#3F3F46",
              marginBottom: "8%",
            }}
          >
            to
          </Box>
          <Box>
            <Controller
              name="maxValue"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  variant="standard"
                  fullWidth
                  displayEmpty
                  disableUnderline
                  sx={{
                    borderRadius: "8px",
                    height: "42px",
                    backgroundColor: "#F3F4F6",
                    fontSize: "15px",
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
                    "& .MuiSelect-icon": {
                      color: "#4338CA",
                    },
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    mb: 2,
                  }}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    field.onChange(value);
                    dispatch(updateMaxValue(value));
                    markFormTouched();
                  }}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ScaleRangeSettings;
