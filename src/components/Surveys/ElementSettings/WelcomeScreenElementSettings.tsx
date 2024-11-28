import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { useUpdateElementSettingsMutation } from "../../../app/slices/elementApiSlice";
import { welcomeSettingsSchema } from "../../../utils/schema";
import { ElementSettingsProps, QuestionSetting } from "../../../utils/types";





const WelcomeScreenElementSettings = ({
  qID,
  qText,
  qSettings,
}: ElementSettingsProps) => {
  const [updateElementSettings] = useUpdateElementSettingsMutation();

  const { buttonText } = qSettings || { buttonText: "Let's Start" };

  const { handleSubmit, control } = useForm<QuestionSetting>({
    resolver: zodResolver(welcomeSettingsSchema),
    defaultValues: {
      welcomeText: qText,
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
      const { welcomeText, buttonText } = data;

      const settings = { buttonText };
      await updateElementSettings({
        questionID: qID,
        text: welcomeText,
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
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "98%",
          minHeight: "100px",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginRight: "auto",
              marginLeft: "auto",
              width: "92%",
              minHeight: "200px",
            }}
          >
            <Accordion
              sx={{ width: "100%", backgroundColor: "#F7F7F7" }}
              defaultExpanded
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Box sx={{ fontWeight: 500, color: "#453F46" }}>Title Text</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1%",
                    margin: "auto",
                    marginTop: "4%",
                    marginBottom: "8%",
                    width: "98%",
                    // border: "2px solid orange",
                  }}
                >
                  <Box sx={{ fontWeight: 500 }}>Welcome Message</Box>
                  <Box mt={1}>
                    <Controller
                      name="welcomeText"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          type="text"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "36px",
                              fontSize: "16px",
                              backgroundColor: "#FFFFFF",
                            },
                          }}
                          {...field}
                          onChange={(event) => {
                            const value = event.target.value;
                            field.onChange(value);
                            setFormState((prev) => ({
                              ...prev,
                              welcomeText: value,
                            }));
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                marginTop: "6%",
                width: "100%",
                backgroundColor: "#F7F7F7",
              }}
              defaultExpanded
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Box sx={{ fontWeight: 500, color: "#453F46" }}>Button</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1%",
                    margin: "auto",
                    marginTop: "4%",
                    marginBottom: "8%",
                    width: "98%",
                    // border: "2px solid orange",
                  }}
                >
                  <Box mt={1}>
                    <Controller
                      name="buttonText"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          type="text"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "36px",
                              fontSize: "16px",
                              backgroundColor: "#FFFFFF",
                            },
                          }}
                          {...field}
                          value={formState.buttonText}
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
                          helperText={`${inputLength}/24`}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default WelcomeScreenElementSettings;
