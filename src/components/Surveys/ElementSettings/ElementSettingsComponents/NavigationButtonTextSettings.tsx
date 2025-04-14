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
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import {
  QuestionSetting,
  ScreenTypographySettingsProps,
} from "../../../../utils/types";

const NavigationButtonTextSettings = ({
  qID,
  questionPreferences,
}: ScreenTypographySettingsProps) => {
  const [updateQuestionPreferenceUIConfig] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const { buttonText } = questionPreferences?.uiConfig || {
    buttonText: "Next",
  };

  const { handleSubmit, control } = useForm<QuestionSetting>({
    resolver: zodResolver(uiConfigPreferenceSchema),
    defaultValues: {
      buttonText,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    buttonText,
  });

  const [inputLength, setInputLength] = useState(
    formState?.buttonText?.length || 0
  );

  const previousFormState = useRef<QuestionSetting>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const { buttonText } = data;

      const config = { buttonText };
      await updateQuestionPreferenceUIConfig({
        questionID: qID,
        config,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const hasChanged =
      JSON.stringify(formState) !== JSON.stringify(previousFormState.current);

    if (!hasChanged) return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 1000);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [formState, handleSubmit]);

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
            Navigation Button Text
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
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "40px",
                        fontSize: "16px",
                        borderRadius: 2,
                        backgroundColor: "#F9FAFB",
                      },
                    }}
                    {...field}
                    value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value.length <= 24) {
                        field.onChange(value);
                        setFormState((prev) => ({
                          ...prev,
                          button1Text: value,
                        }));
                        setInputLength(value.length);
                      }
                    }}
                    InputProps={{
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
