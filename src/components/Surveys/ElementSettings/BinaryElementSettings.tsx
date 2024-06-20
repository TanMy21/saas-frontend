import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionSetting } from "../../../utils/types";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import { binarySettingsSchema } from "../../../utils/schema";
import Switch from "@mui/joy/Switch";

const BinaryElementSettings = () => {
  const {
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm<QuestionSetting>({
    resolver: zodResolver(binarySettingsSchema),
    defaultValues: {
      questionText: "",
      required: false,
      button1Text: "",
      button2Text: "",
    },
  });

  const [inputLength1, setInputLength1] = useState(0);
  const [inputLength2, setInputLength2] = useState(0);

  const [formState, setFormState] = useState<QuestionSetting>({
    questionText: "",
    required: false,
    button1Text: "",
    button2Text: "",
  });

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = (data: QuestionSetting) => {
    const { required, questionText, button1Text, button2Text } = data;
    console.log("Form Data:", required, questionText, button1Text, button2Text);
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
              <Box sx={{ fontWeight: 500 }}>Button 1</Box>
              <Box mt={1}>
                <Controller
                  name="button1Text"
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
                      value={formState.button1Text}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(value);
                        setFormState((prev) => ({
                          ...prev,
                          button1Text: value,
                        }));
                        setInputLength1(value.length);
                      }}
                      helperText={`${inputLength1}/24`}
                    />
                  )}
                />
              </Box>
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
              <Box sx={{ fontWeight: 500 }}>Button 2</Box>
              <Box mt={1}>
                <Controller
                  name="button2Text"
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
                      value={formState.button2Text}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(value);
                        setFormState((prev) => ({
                          ...prev,
                          button2Text: value,
                        }));
                        setInputLength2(value.length);
                      }}
                      helperText={`${inputLength2}/24`}
                    />
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

export default BinaryElementSettings;
