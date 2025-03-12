import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { useUpdateElementTextMutation } from "../../../app/slices/elementApiSlice";
import { instructionsSettingsSchema } from "../../../utils/schema";
import { ElementSettingsProps, QuestionSetting } from "../../../utils/types";

const InstructionsElementSettings = ({ qID, qText }: ElementSettingsProps) => {
  const [updateElementText] = useUpdateElementTextMutation();

  const { handleSubmit, control } = useForm<QuestionSetting>({
    resolver: zodResolver(instructionsSettingsSchema),
    defaultValues: {
      instructionsTitle: qText,
    },
  });

  const [formState, setFormState] = useState<QuestionSetting>({
    instructionsTitle: qText,
  });

  const previousFormState = useRef<QuestionSetting>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const { instructionsTitle } = data;

      await updateElementText({
        questionID: qID,
        text: instructionsTitle,
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
              <Accordion
                sx={{ width: "100%", backgroundColor: "#F7F7F7" }}
                defaultExpanded
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Box sx={{ fontWeight: 500, color: "#453F46" }}>
                    Title Text
                  </Box>
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
                    <Box sx={{ fontWeight: 500 }}>Text</Box>
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
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default InstructionsElementSettings;
