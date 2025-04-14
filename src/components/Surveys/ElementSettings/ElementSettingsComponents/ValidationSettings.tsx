import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Switch from "@mui/joy/Switch";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { useUpdateQuestionRequiredPreferenceMutation } from "../../../../app/slices/elementApiSlice";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import {
  QuestionSetting,
  ScreenTypographySettingsProps,
} from "../../../../utils/types";

const ValidationSettings = ({
  qID,
  questionPreferences,
}: ScreenTypographySettingsProps) => {
  const [updateQuestionRequiredPreference] =
    useUpdateQuestionRequiredPreferenceMutation();

  const { handleSubmit, control } = useForm<QuestionSetting>({
    resolver: zodResolver(uiConfigPreferenceSchema),
    defaultValues: {
      required: questionPreferences?.required || false,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    required: questionPreferences?.required || false,
  });

  const previousFormState = useRef<QuestionSetting>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const { required } = data;

      await updateQuestionRequiredPreference({
        questionID: qID,
        required,
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
              color: "#453F46",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ color: "#752FEC", fontSize: "20px" }}
            />
            Response Validation
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
              <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>Required</Box>
              <Box mt={1}>
                <Controller
                  name="required"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={(event) => {
                        const value = event.target.checked;
                        field.onChange(value);
                        setFormState((prev) => ({
                          ...prev,
                          required: value,
                        }));
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </form>
  );
};

export default ValidationSettings;
