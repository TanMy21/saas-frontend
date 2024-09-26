import { Controller, useForm } from "react-hook-form";
import { ElementSettingsProps, QuestionSetting } from "../../../utils/types";
import { instructionsSettingsSchema } from "../../../utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import { useUpdateElementSettingsMutation } from "../../../app/slices/elementApiSlice";

const InstructionsElementSettings = ({
  qID,
  qText,
  qSettings,
}: ElementSettingsProps) => {
  const [updateElementSettings] = useUpdateElementSettingsMutation();

  const { buttonText } = qSettings || { buttonText: "" };

  const {
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm<QuestionSetting>({
    resolver: zodResolver(instructionsSettingsSchema),
    defaultValues: {
      instructionsTitle: qText,
      buttonText,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    instructionsTitle: qText,
    buttonText,
  });

  const previousFormState = useRef<QuestionSetting>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const { instructionsTitle, buttonText } = data;

      const settings = { buttonText };
      await updateElementSettings({
        questionID: qID,
        text: instructionsTitle,
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
              <Box sx={{ fontWeight: 500 }}>Title</Box>
              <Box mt={1}>
                <Controller
                  name="instructionsTitle"
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
                          instructionsTitle: value,
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

export default InstructionsElementSettings;
