import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FiType } from "react-icons/fi";

import { TypographySettingsFormSchema } from "../../../../utils/schema";
import { TypographySettingsForm } from "../../../../utils/types";

import ColorPicker from "./ColorPicker";

const ScreenTypographySettings = () => {
  const { handleSubmit, control } = useForm<TypographySettingsForm>({
    resolver: zodResolver(TypographySettingsFormSchema),
    defaultValues: {
      textFontSize: 12,
      textColor: "#000000",
      descriptionFontSize: 12,
      descriptionColor: "#000000",
    },
  });

  const [formState, setFormState] = useState<TypographySettingsForm>({
    textFontSize: 12,
    textColor: "#000000",
    descriptionFontSize: 12,
    descriptionColor: "#000000",
  });

  const previousFormState = useRef<TypographySettingsForm>(formState);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = (data: TypographySettingsForm) => {
    try {
      console.log("data: ", data);
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Accordion
          defaultExpanded
          sx={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #E0E0E0",
            borderRadius: 0,
            boxShadow: "none",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="typography-settings"
            id="typography-settings-header"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                fontWeight: 500,
                color: "#453F46",
              }}
            >
              <FiType style={{ color: "#752FEC" }} />
              Typography Settings
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "96%",
                height: "100%",
                marginLeft: "4%",
                // border: "2px solid red",
              }}
            >
              {/* === TEXT SETTINGS === */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#444D5C"
                  sx={{ mb: 2 }}
                >
                  Text
                </Typography>
                {/* Font Size */}
                <Box sx={{ mb: 1, ml: 1, width: "98%" }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: "bold", color: "#444D5C" }}
                  >
                    Font Size
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      width: "96%",
                      ml: 1,
                      alignItems: "center",
                      gap: 2,
                      //   border: "1px solid red",
                    }}
                  >
                    <Controller
                      name="textFontSize"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Slider
                            min={8}
                            max={72}
                            value={field.value}
                            onChange={(_, val) => field.onChange(val)}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            inputProps={{ min: 8, max: 72 }}
                            sx={{
                              width: 60,
                              "& .MuiInputBase-root": {
                                borderRadius: 2,
                                backgroundColor: "#F9FAFB",
                                height: "40px",
                                fontSize: "16px",
                              },
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            px
                          </Typography>
                        </>
                      )}
                    />
                  </Box>
                </Box>
                {/* Text Color */}
                <Box sx={{ mb: 1, ml: 1, width: "98%" }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: "bold", color: "#444D5C" }}
                  >
                    Text Color
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "96%",
                      height: "40px",
                      gap: 4,
                    }}
                  >
                    <Controller
                      name="textColor"
                      control={control}
                      render={({ field }) => (
                        <>
                          <ColorPicker
                            color={field.value}
                            setColor={field.onChange}
                          />
                          <TextField
                            type="text"
                            value={field.value.toUpperCase()}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder={field.value.toUpperCase()}
                            sx={{
                              flex: 1,
                              "& .MuiInputBase-root": {
                                borderRadius: 2,
                                backgroundColor: "#F9FAFB",
                                width: "64%",
                                height: "40px",
                                fontSize: "16px",
                              },
                            }}
                          />
                        </>
                      )}
                    />
                  </Box>
                </Box>
              </Box>

              {/* === DESCRIPTION SETTINGS === */}
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#444D5C"
                  sx={{ mb: 2 }}
                >
                  Description
                </Typography>
                {/* Font Size */}
                <Box sx={{ mb: 1, ml: 1, width: "98%" }}>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: "bold", color: "#444D5C" }}
                  >
                    Font Size
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      width: "96%",
                      ml: 1,
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Controller
                      name="descriptionFontSize"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Slider
                            min={8}
                            max={72}
                            value={field.value}
                            onChange={(_, val) => field.onChange(val)}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            inputProps={{ min: 8, max: 72 }}
                            sx={{
                              width: 60,
                              "& .MuiInputBase-root": {
                                borderRadius: 2,
                                backgroundColor: "#F9FAFB",
                                height: "40px",
                                fontSize: "16px",
                              },
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            px
                          </Typography>
                        </>
                      )}
                    />
                  </Box>
                </Box>
                {/* Description Color */}
                <Box sx={{ mb: 1, ml: 1, width: "98%" }}>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: "bold", color: "#444D5C" }}
                  >
                    Description Color
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "96%",
                      height: "40px",
                      gap: 4,
                    }}
                  >
                    <Controller
                      name="descriptionColor"
                      control={control}
                      render={({ field }) => (
                        <>
                          {" "}
                          <ColorPicker
                            color={field.value}
                            setColor={field.onChange}
                          />
                          <TextField
                            type="text"
                            value={field.value.toUpperCase()}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder={field.value.toUpperCase()}
                            sx={{
                              flex: 1,
                              "& .MuiInputBase-root": {
                                borderRadius: 2,
                                backgroundColor: "#F9FAFB",
                                width: "64%",
                                height: "40px",
                                fontSize: "16px",
                              },
                            }}
                          />
                        </>
                      )}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </form>
    </>
  );
};

export default ScreenTypographySettings;
