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
import { numberSettingsSchema } from "../../../utils/schema";
import { ElementSettingsProps, QuestionSetting } from "../../../utils/types";

const NumberElementSettings = ({
  qID,
  qText,
  qRequired,
  qDescription,
  qSettings,
}: ElementSettingsProps) => {
  const [updateElementSettings] = useUpdateElementSettingsMutation();

  const { minValue, maxValue, minSwitch, maxSwitch } = qSettings || {
    minValue: 0,
    maxValue: 0,
    minSwitch: false,
    maxSwitch: false,
  };

  const { handleSubmit, control } = useForm<QuestionSetting>({
    resolver: zodResolver(numberSettingsSchema),
    defaultValues: {
      questionText: qText,
      required: qRequired,
      description: qDescription,
      minSwitch,
      maxSwitch,
      minValue,
      maxValue,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    questionText: qText,
    required: qRequired,
    description: qDescription,
    minSwitch,
    maxSwitch,
    minValue,
    maxValue,
  });

  const previousFormState = useRef<QuestionSetting>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const {
        questionText,
        required,
        description,
        minValue,
        maxValue,
        minSwitch,
        maxSwitch,
      } = data;
      const settings = { minValue, maxValue, minSwitch, maxSwitch };
      await updateElementSettings({
        questionID: qID,
        text: questionText,
        description,
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
    }, 2000);

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
                <Box sx={{ fontWeight: 500, color: "#453F46" }}>Question</Box>
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
                  <Box sx={{ fontWeight: 500 }}>Question Text</Box>
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
                            description: value,
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
                  <Box sx={{ fontWeight: 500 }}>Required</Box>
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
                <Box sx={{ fontWeight: 500, color: "#453F46" }}>Range</Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  mt={1}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0%",
                    width: "98%",
                  }}
                >
                  <Box
                    mt={1}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "98%",
                    }}
                  >
                    <Box sx={{ fontWeight: 500 }}>Min number</Box>
                    <Box mt={1}>
                      <Controller
                        name="minSwitch"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onChange={(event) => {
                              field.onChange(event.target.checked);
                              setFormState((prev) => ({
                                ...prev,
                                minSwitch: event.target.checked,
                              }));
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                  {formState.minSwitch && (
                    <Box mt={1} mb={1}>
                      <Box>
                        <Controller
                          name="minValue"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              type="number"
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: "36px",
                                  fontSize: "16px",
                                },
                              }}
                              {...field}
                              onChange={(event) => {
                                const value = Number(event.target.value);
                                field.onChange(value);
                                setFormState((prev) => ({
                                  ...prev,
                                  minValue: value,
                                }));
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Box>
                  )}
                  <Box
                    mt={1}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "98%",
                    }}
                  >
                    <Box sx={{ fontWeight: 500 }}>Max number</Box>
                    <Box mt={1}>
                      <Controller
                        name="maxSwitch"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onChange={(event) => {
                              field.onChange(event.target.checked);
                              setFormState((prev) => ({
                                ...prev,
                                maxSwitch: event.target.checked,
                              }));
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                  {formState.maxSwitch && (
                    <Box mt={1}>
                      <Box>
                        <Controller
                          name="maxValue"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              type="number"
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: "36px",
                                  fontSize: "16px",
                                },
                              }}
                              {...field}
                              onChange={(event) => {
                                const value = Number(event.target.value);
                                field.onChange(value);
                                setFormState((prev) => ({
                                  ...prev,
                                  maxValue: value,
                                }));
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default NumberElementSettings;
