import { useState, useRef, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  TextField,
} from "@mui/material";
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
            <Accordion
              sx={{ width: "100%", backgroundColor: "#F7F7F7" }}
              defaultExpanded
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Box sx={{ fontWeight: 500, color: "#453F46" }}>Title Text</Box>
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
              </AccordionDetails>
            </Accordion>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EndScreenElementSettings;
