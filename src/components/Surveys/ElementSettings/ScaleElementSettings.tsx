import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Switch from "@mui/joy/Switch";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { useUpdateElementSettingsMutation } from "../../../app/slices/elementApiSlice";
import { scaleSettingsSchema } from "../../../utils/schema";
import { ElementSettingsProps, QuestionSetting } from "../../../utils/types";

const ScaleElementSettings = ({
  qID,
  qText,
  qRequired,
  qDescription,
  qSettings,
}: ElementSettingsProps) => {
  const [updateElementSettings] = useUpdateElementSettingsMutation();
  const minOptions = [0, 1];
  const maxOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const { minValue, maxValue } = qSettings || { minValue: 0, maxValue: 10 };

  const { handleSubmit, control } = useForm<QuestionSetting>({
    resolver: zodResolver(scaleSettingsSchema),
    defaultValues: {
      required: qRequired,
      questionText: qText,
      description: qDescription,
      minValue,
      maxValue,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    required: qRequired,
    questionText: qText,
    description: qDescription,
    minValue,
    maxValue,
  });

  const previousFormState = useRef<QuestionSetting>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const { required, questionText, description, minValue, maxValue } = data;

      const settings = { minValue, maxValue };
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
              sx={{ width: "100%", backgroundColor: "#F7F7F7" }}
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
                          value={field.value}
                          sx={{
                            "& .MuiInputBase-root": {
                              backgroundColor: "#FFFFFF",
                            },
                          }}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            field.onChange(value);
                            setFormState((prev) => ({
                              ...prev,
                              minValue: value,
                            }));
                          }}
                        >
                          {minOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Box>
                  <Box> to </Box>
                  <Box>
                    <Controller
                      name="maxValue"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          sx={{
                            "& .MuiInputBase-root": {
                              backgroundColor: "#FFFFFF",
                            },
                          }}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            field.onChange(value);
                            setFormState((prev) => ({
                              ...prev,
                              maxValue: value,
                            }));
                          }}
                        >
                          {maxOptions.map((option) => (
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
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ScaleElementSettings;
