import { Controller, useForm } from "react-hook-form";
import { QuestionSetting } from "../../../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailContactSettingsSchema } from "../../../utils/schema";
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Switch from "@mui/joy/Switch";

const EmailContactElementSettings = () => {
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    // formState: { errors },
  } = useForm<QuestionSetting>({
    resolver: zodResolver(emailContactSettingsSchema),
    defaultValues: {
      required: false,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    required: false,
  });

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = (data: QuestionSetting) => {
    const { required } = data;
    console.log("Form Data:", required);
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
