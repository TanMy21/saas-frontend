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
import { Controller, useForm, useWatch } from "react-hook-form";
import { FiType } from "react-icons/fi";

import { useUpdateElementSettingsMutation } from "../../../../app/slices/elementApiSlice";
import { TypographySettingsFormSchema } from "../../../../utils/schema";
import {
  ScreenTypographySettingsProps,
  TypographySettingsForm,
} from "../../../../utils/types";

import ColorPicker from "./ColorPicker";

const ScreenTypographySettings = ({ qID }: ScreenTypographySettingsProps) => {
  const [updateElementSettings] = useUpdateElementSettingsMutation();

  const { handleSubmit, control } = useForm<TypographySettingsForm>({
    resolver: zodResolver(TypographySettingsFormSchema),
    defaultValues: {
      titleFontSize: 12,
      titleFontColor: "#000000",
      descriptionFontSize: 12,
      descriptionFontColor: "#000000",
    },
  });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: TypographySettingsForm) => {
    try {
      console.log("Autosaved: ", data);

      const {
        titleFontSize,
        titleFontColor,
        descriptionFontColor,
        descriptionFontSize,
      } = data;

      await updateElementSettings({
        questionID: qID,
        titleFontSize,
        titleFontColor,
        descriptionFontColor,
        descriptionFontSize,
      }).unwrap();
      setFormTouched(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!formTouched) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit)();
      setFormTouched(false);
    }, 2500);
  }, [watchedValues, formTouched, handleSubmit]);

  const markFormTouched = () => {
    if (!formTouched) setFormTouched(true);
  };

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
                      name="titleFontSize"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Slider
                            min={8}
                            max={72}
                            value={field.value}
                            onChange={(_, val) => {
                              field.onChange(val);
                              markFormTouched();
                            }}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            type="number"
                            value={field.value}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(value);
                              markFormTouched(); // 🟢
                            }}
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
                      name="titleFontColor"
                      control={control}
                      render={({ field }) => (
                        <>
                          <ColorPicker
                            color={field.value}
                            setColor={(color: string) => {
                              field.onChange(color);
                              markFormTouched();
                            }}
                          />
                          <TextField
                            type="text"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              markFormTouched();
                            }}
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
                            onChange={(_, val) => {
                              field.onChange(val);
                              markFormTouched();
                            }}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            type="number"
                            value={field.value}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(value);
                              markFormTouched();
                            }}
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
                      name="descriptionFontColor"
                      control={control}
                      render={({ field }) => (
                        <>
                          <ColorPicker
                            color={field.value}
                            setColor={(color: string) => {
                              field.onChange(color);
                              markFormTouched();
                            }}
                          />
                          <TextField
                            type="text"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              markFormTouched();
                            }}
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
