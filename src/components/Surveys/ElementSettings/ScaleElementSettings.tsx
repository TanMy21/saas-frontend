import { zodResolver } from "@hookform/resolvers/zod";
import { scaleSettingsSchema } from "../../../utils/schema";
import { QuestionSetting } from "../../../utils/types";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Box, MenuItem, Select, Switch, TextField } from "@mui/material";

const ScaleElementSettings = () => {
  const minOptions = [0, 1];
  const maxOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const { handleSubmit, watch, control, setValue } = useForm<QuestionSetting>({
    resolver: zodResolver(scaleSettingsSchema),
    defaultValues: {
      required: false,
      questionText: "",
      minValue: 0,
      maxValue: 10,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    required: false,
    questionText: "",
    minValue: 0,
    maxValue: 10,
  });

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = (data: QuestionSetting) => {
    const { required, questionText, minValue, maxValue } = data;
    console.log("Form Data:", required, questionText, minValue, maxValue);
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
                marginTop: "0%",
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
                marginTop: "0%",
              }}
            >
              <Box>
                <Controller
                  name="minValue"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
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
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ScaleElementSettings;
