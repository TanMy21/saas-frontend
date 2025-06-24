import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavigationIcon from "@mui/icons-material/Navigation";
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
import { useDispatch, useSelector } from "react-redux";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import { updateUIButtonText } from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { QuestionSetting } from "../../../../utils/types";

const NavigationButtonTextSettings = () => {
  const dispatch = useDispatch();
  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const { questionID, questionPreferences } = question || {};

  const [updateQuestionPreferenceUIConfig] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const { buttonText } = questionPreferences?.uiConfig || {
    buttonText: "Next",
  };

  const { handleSubmit, control, reset } = useForm<QuestionSetting>({
    resolver: zodResolver(uiConfigPreferenceSchema),
    defaultValues: {
      buttonText,
    },
  });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [inputLength, setInputLength] = useState(
    questionPreferences?.uiConfig?.buttonText?.length ?? 0
  );

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const { buttonText } = data;

      if (buttonText === questionPreferences?.uiConfig?.buttonText) return;

      const uiConfig = { buttonText };
      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const markFormTouched = () => {
    if (!formTouched) setFormTouched(true);
  };

  useEffect(() => {
    if (!formTouched) setFormTouched(true);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit)();
      setFormTouched(false);
    }, 2500);
  }, [watchedValues, formTouched, handleSubmit]);

  useEffect(() => {
    if (buttonText !== undefined) {
      reset({
        buttonText,
      });
    }
  }, [buttonText, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Accordion
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #E0E0E0",
          borderRadius: 0,
          boxShadow: "none",
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
              // pl: "4%",
              color: "#453F46",
            }}
          >
            <NavigationIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
            <Tooltip title="Set the text on the navigation button">
              <Typography>Navigation button</Typography>
            </Tooltip>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "96%",
              height: "100%",
              marginLeft: "4%",
              // border: "2px solid red",
            }}
          >
            <Box sx={{ marginTop: "2%", fontWeight: 500, color: "#3F3F46" }}>
              Button
            </Box>
            <Box mt={1}>
              <Controller
                name="buttonText"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="text"
                    variant="standard"
                    placeholder="Enter your question"
                    fullWidth
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
                    {...field}
                    value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value.length <= 24) {
                        field.onChange(value);
                        markFormTouched();
                        dispatch(updateUIButtonText(value));
                        setInputLength(value.length);
                      }
                    }}
                    InputProps={{
                      disableUnderline: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box
                            sx={{ fontSize: "12px", color: "#9E9E9E", pr: 1 }}
                          >
                            {inputLength}/24
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </form>
  );
};

export default NavigationButtonTextSettings;
