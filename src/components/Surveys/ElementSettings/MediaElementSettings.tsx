import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Switch from "@mui/joy/Switch";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { useUpdateElementSettingsMutation } from "../../../app/slices/elementApiSlice";
import { mediaSettingsSchema } from "../../../utils/schema";
import { ElementSettingsProps, QuestionSetting } from "../../../utils/types";




const MediaElementSettings = ({
  qID,
  qText,
  qRequired,
  qSettings,
}: ElementSettingsProps) => {
  const [updateElementSettings] = useUpdateElementSettingsMutation();

  const { multipleSelection, superSize } = qSettings || {
    multipleSelection: false,
    superSize: false,
  };

  const { handleSubmit, control } = useForm<QuestionSetting>({
    resolver: zodResolver(mediaSettingsSchema),
    defaultValues: {
      required: qRequired,
      multipleSelection,
      superSize,
      questionText: qText,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    required: qRequired,
    multipleSelection,
    superSize,
    questionText: qText,
  });

  const previousFormState = useRef<QuestionSetting>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const { required, questionText, multipleSelection, superSize } = data;
      const settings = { multipleSelection, superSize };
      await updateElementSettings({
        questionID: qID,
        text: questionText,
        required,
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
              gap: "1%",
              margin: "auto",
              marginTop: "4%",
              marginBottom: "8%",
              width: "98%",
              // border: "2px solid orange",
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
                <Box sx={{ fontWeight: 500, color: "#453F46" }}>Question</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>
                  Question Text
                </Box>
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
                            questionText: value,
                          }));
                        }}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>
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
                        maxRows={4}
                        fullWidth
                        sx={{
                          "& .MuiInputBase-root": {
                            width: "100%",
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
                            questionText: value,
                          }));
                        }}
                      />
                    )}
                  />
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
                <Box sx={{ fontWeight: 500, color: "#453F46" }}>Validation</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  mt={1}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0%",
                    width: "98%",
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
                <Box sx={{ fontWeight: 500, color: "#453F46" }}>Settings</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  mt={1}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0%",
                  }}
                >
                  <Box sx={{ fontWeight: 500 }}>Multiple selection</Box>
                  <Box mt={1}>
                    <Controller
                      name="multipleSelection"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={(event) => {
                            const value = event.target.checked;
                            field.onChange(value);
                            setFormState((prev) => ({
                              ...prev,
                              multipleSelection: value,
                            }));
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
                <Box
                  mt={1}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0%",
                  }}
                >
                  <Box sx={{ fontWeight: 500 }}>Supersize</Box>
                  <Box mt={1}>
                    <Controller
                      name="superSize"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={(event) => {
                            const value = event.target.checked;
                            field.onChange(value);
                            setFormState((prev) => ({
                              ...prev,
                              superSize: value,
                            }));
                          }}
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

export default MediaElementSettings;
