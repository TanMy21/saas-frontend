import { Controller, useForm } from "react-hook-form";
import { ElementSettingsProps, QuestionSetting } from "../../../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailContactSettingsSchema } from "../../../utils/schema";
import { useEffect, useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import Switch from "@mui/joy/Switch";
import { useUpdateElementSettingsMutation } from "../../../app/slices/elementApiSlice";

const EmailContactElementSettings = ({
  qID,
  qText,
  qRequired,
}: ElementSettingsProps) => {
  const [updateElementSettings] = useUpdateElementSettingsMutation();

  const { handleSubmit, control } = useForm<QuestionSetting>({
    resolver: zodResolver(emailContactSettingsSchema),
    defaultValues: {
      required: qRequired,
      questionText: qText,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    required: qRequired,
    questionText: qText,
  });

  const previousFormState = useRef<QuestionSetting>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    const hasChanged =
      JSON.stringify(formState) !== JSON.stringify(previousFormState.current);

    if (!hasChanged) return;

    try {
      const { questionText, required } = data;

      const settings = {};
      await updateElementSettings({
        questionID: qID,
        required,
        text: questionText,
        settings,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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
              <Box sx={{ fontWeight: 500 }}>Text</Box>
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
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EmailContactElementSettings;
