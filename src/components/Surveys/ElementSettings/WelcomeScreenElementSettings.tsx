import { Controller, useForm } from "react-hook-form";
import { QuestionSetting } from "../../../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { welcomeSettingsSchema } from "../../../utils/schema";
import { Box, TextField } from "@mui/material";

const WelcomeScreenElementSettings = () => {
  const {
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm<QuestionSetting>({
    resolver: zodResolver(welcomeSettingsSchema),
    defaultValues: {
      welcomeText: "",
      buttonText: "",
    },
  });

  const [inputLength, setInputLength] = useState(0);
  const [formState, setFormState] = useState<QuestionSetting>({
    welcomeText: "",
    buttonText: "",
  });

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = (data: QuestionSetting) => {
    const { welcomeText, buttonText } = data;
    console.log("Form Data:", welcomeText, buttonText);
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
              <Box sx={{ fontWeight: 500 }}>Button</Box>
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
                        },
                      }}
                      {...field}
                      value={formState.buttonText}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(value);
                        setFormState((prev) => ({
                          ...prev,
                          buttonText: value,
                        }));
                        setInputLength(value.length);
                      }}
                      helperText={`${inputLength}/24`}
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

export default WelcomeScreenElementSettings;
