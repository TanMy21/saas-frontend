import { zodResolver } from "@hookform/resolvers/zod";
import { Box, TextField } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useUpdateElementSettingsMutation } from "../../../app/slices/elementApiSlice";
import { endScreenContactSettingsSchema } from "../../../utils/schema";
import { ElementSettingsProps, QuestionSetting } from "../../../utils/types";

const EndScreenElementSettings = ({ qID, qText }: ElementSettingsProps) => {
  const [updateElementSettings] = useUpdateElementSettingsMutation();

  const { handleSubmit, control } = useForm<QuestionSetting>({
    resolver: zodResolver(endScreenContactSettingsSchema),
    defaultValues: {
      questionText: qText,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    questionText: qText,
  });

  const previousFormState = useRef<QuestionSetting>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const { questionText } = data;

      const settings = {};
      await updateElementSettings({
        questionID: qID,

        text: questionText,
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
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EndScreenElementSettings;
