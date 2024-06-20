import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { QuestionSetting } from "../../../utils/types";
import { Box, TextField } from "@mui/material";
import { numberSettingsSchema } from "../../../utils/schema";
import Switch from "@mui/joy/Switch";
import { useEffect, useRef, useState } from "react";

const NumberElementSettings = () => {
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    // formState: { errors },
  } = useForm<QuestionSetting>({
    resolver: zodResolver(numberSettingsSchema),
    defaultValues: {
      questionText: "",
      required: false,
      minSwitch: false,
      maxSwitch: false,
      minValue: 0,
      maxValue: 10,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    questionText: "",
    required: false,
    minSwitch: false,
    maxSwitch: false,
    minValue: 0,
    maxValue: 10,
  });

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = (data: QuestionSetting) => {
    const { questionText, required, minValue, maxValue } = data;
    console.log("Form Data:", questionText, required, minValue, maxValue);
  };

  useEffect(() => {
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
            <Box mt={1} sx={{ fontSize: "16px", fontWeight: 700 }}>
              Settings
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                <Box sx={{ fontWeight: 500 }}>Question</Box>
                <Box mt={1}>
                  <Controller
                    name="questionText"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        type="text"
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "36px",
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
              </Box>
              <Box
                mt={1}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
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
              <Box
                mt={1}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
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
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default NumberElementSettings;
