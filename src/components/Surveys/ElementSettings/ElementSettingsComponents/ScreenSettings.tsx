import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

import { useUpdateScreenElementsMutation } from "../../../../app/slices/elementApiSlice";
import { welcomeSettingsSchema } from "../../../../utils/schema";
import { QuestionSetting, ScreenSettingsProps } from "../../../../utils/types";

const ScreenSettings = ({
  qID,
  qText,
  qDescription,
  qSettings,
}: ScreenSettingsProps) => {
  const [updateScreenElements] = useUpdateScreenElementsMutation();

  const { buttonText } = qSettings || { buttonText: "Let's Start" };

  const { handleSubmit, control } = useForm<QuestionSetting>({
    resolver: zodResolver(welcomeSettingsSchema),
    defaultValues: {
      questionText: qText,
      description: qDescription,
      buttonText,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    welcomeText: qText,
    buttonText,
  });

  const [inputLength, setInputLength] = useState(
    formState?.buttonText?.length || 0
  );

  const previousFormState = useRef<QuestionSetting>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      console.log("data: ", data);

      const { questionText, description, buttonText } = data;

      const settings = { buttonText };
      await updateScreenElements({
        questionID: qID,
        text: questionText,
        description,
        settings,
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
              // pl: "4%",
              color: "#453F46",
            }}
          >
            <HelpOutlineIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
            Question
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
            <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>Question Text</Box>
            <Box mt={1}>
              <Controller
                name="questionText"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="text"
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: 2,
                        backgroundColor: "#F9FAFB",
                        height: "40px",
                        fontSize: "16px",
                      },
                    }}
                    {...field}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value);
                      setFormState((prev) => ({
                        ...prev,
                        questionText: value,
                      }));
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{ marginTop: "2%", fontWeight: 500, color: "#3F3F46" }}>
              Description
            </Box>
            <Box mt={1}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="text"
                    multiline
                    fullWidth
                    maxRows={4}
                    sx={{
                      "& .MuiInputBase-root": {
                        width: "100%",
                        height: "40px",
                        fontSize: "16px",
                        borderRadius: 2,
                        backgroundColor: "#F9FAFB",
                        minHeight: "40px",
                        boxSizing: "border-box",
                      },
                      "& .MuiInputBase-input": {
                        lineHeight: "1.5",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                    {...field}
                    value={
                      field.value === ""
                        ? "Description (optional)"
                        : field.value
                    }
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value);
                      setFormState((prev) => ({
                        ...prev,
                        description: value,
                      }));
                    }}
                  />
                )}
              />
            </Box>
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

export default ScreenSettings;
