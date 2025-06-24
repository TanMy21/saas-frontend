import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  InputAdornment,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FiType } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

import { useUpdateElementTypographyMutation } from "../../../../app/slices/elementApiSlice";
import { updateTypographyField } from "../../../../app/slices/elementTypographySlice";
import { RootState } from "../../../../app/store";
import { TypographySettingsFormSchema } from "../../../../utils/schema";
import {
  ScreenTypographySettingsProps,
  TypographySettingsForm,
} from "../../../../utils/types";

import ColorPicker from "./ColorPicker";

const ScreenTypographySettings = ({ qID }: ScreenTypographySettingsProps) => {
  const typographySettings = useSelector(
    (state: RootState) => state.elementTypography
  );
  const dispatch = useDispatch();

  const [updateElementTypography] = useUpdateElementTypographyMutation();

  const {
    titleFontColor,
    titleFontSize,
    descriptionFontColor,
    descriptionFontSize,
  } = typographySettings || {};

  const { handleSubmit, control, reset } = useForm<TypographySettingsForm>({
    resolver: zodResolver(TypographySettingsFormSchema),
    defaultValues: {
      titleFontSize,
      titleFontColor,
      descriptionFontSize,
      descriptionFontColor,
    },
  });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: TypographySettingsForm) => {
    try {
      const {
        titleFontSize,
        titleFontColor,
        descriptionFontColor,
        descriptionFontSize,
      } = data;

      await updateElementTypography({
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

  const markFormTouched = () => {
    if (!formTouched) setFormTouched(true);
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

  useEffect(() => {
    reset({
      titleFontSize,
      titleFontColor,
      descriptionFontSize,
      descriptionFontColor,
    });
  }, [
    titleFontSize,
    titleFontColor,
    descriptionFontSize,
    descriptionFontColor,
    reset,
  ]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Accordion
        defaultExpanded={false}
        disableGutters
        elevation={0}
        square
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #E0E0E0",
          borderRadius: 0,
          boxShadow: "none",
          "&:before": { display: "none" },
          "& .MuiAccordionSummary-root": {
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
          },
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
            <Tooltip title="Typography settings for question text and description">
              <Typography>Typography</Typography>
            </Tooltip>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              // border: "2px solid red",
            }}
          >
            {/* === TEXT SETTINGS === */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="#444D5C"
                sx={{ mb: 2, borderBottom: "1px solid #E0E0E0" }}
              >
                Title
              </Typography>
              {/* Font Size */}
              <Box sx={{ mb: 1, ml: 1, width: "98%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: "bold",
                      color: "#444D5C",
                    }}
                  >
                    <FiType style={{ marginBottom: "1%", color: "#752FEC" }} />
                    Font size
                  </Typography>
                  <Controller
                    name="titleFontSize"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        type="number"
                        variant="standard"
                        value={field.value}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                          markFormTouched();
                          dispatch(
                            updateTypographyField({
                              key: "titleFontSize",
                              value: value,
                            })
                          );
                        }}
                        inputProps={{ min: 8, max: 72 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              sx={{ color: "#6846E5", marginBottom: 0.5 }}
                            >
                              px
                            </InputAdornment>
                          ),
                          disableUnderline: true,
                        }}
                        sx={{
                          width: 92,
                          "& .MuiInputBase-root": {
                            borderRadius: 1,
                            backgroundColor: "#EEF2FF",
                            height: "36px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#6846E5",
                            border: "none",
                            boxShadow: "none",
                            px: 1.25,
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Slider below, syncs as before */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "96%",
                    ml: 1,
                  }}
                >
                  <Controller
                    name="titleFontSize"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        min={8}
                        max={72}
                        value={field.value}
                        onChange={(_, val) => {
                          const numericValue = Array.isArray(val)
                            ? val[0]
                            : val;
                          field.onChange(numericValue);
                          markFormTouched();
                          dispatch(
                            updateTypographyField({
                              key: "titleFontSize",
                              value: numericValue,
                            })
                          );
                        }}
                        sx={{ flex: 1 }}
                      />
                    )}
                  />
                </Box>
              </Box>
              {/* Text Color */}
              <Box sx={{ mb: 1, ml: 1, width: "98%" }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                    fontWeight: "bold",
                    color: "#444D5C",
                  }}
                >
                  <ColorLensIcon style={{ color: "#752FEC" }} /> Color
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "96%",
                    height: "40px",
                    marginLeft: 2,
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
                            dispatch(
                              updateTypographyField({
                                key: "titleFontColor",
                                value: color,
                              })
                            );
                          }}
                        />
                        <TextField
                          type="text"
                          variant="standard"
                          value={field.value}
                          onChange={(e) => {
                            let input = e.target.value;

                            if (!input.startsWith("#")) {
                              input = `#${input.replace(/^#*/, "")}`;
                            }
                            field.onChange(input);
                            markFormTouched();
                            dispatch(
                              updateTypographyField({
                                key: "titleFontColor",
                                value: input,
                              })
                            );
                          }}
                          placeholder={field.value?.toUpperCase()}
                          InputProps={{
                            disableUnderline: true,
                          }}
                          sx={{
                            flex: 1,
                            "& .MuiInputBase-root": {
                              borderRadius: 1,
                              width: "80%",
                              height: "36px",
                              fontSize: "16px",
                              backgroundColor: "#EEF2FF",
                              fontWeight: "bold",
                              color: "#6846E5",
                              border: "none",
                              boxShadow: "none",
                              px: 1.25,
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
                sx={{ mb: 2, borderBottom: "1px solid #E0E0E0" }}
              >
                Description
              </Typography>
              {/* Font Size */}
              <Box sx={{ mb: 1, ml: 1, width: "98%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: "bold",
                      color: "#444D5C",
                    }}
                  >
                    <FiType style={{ marginBottom: "1%", color: "#752FEC" }} />{" "}
                    Font size
                  </Typography>

                  <Controller
                    name="descriptionFontSize"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        type="number"
                        variant="standard"
                        value={field.value}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                          markFormTouched();
                          dispatch(
                            updateTypographyField({
                              key: "descriptionFontSize",
                              value: value,
                            })
                          );
                        }}
                        inputProps={{ min: 8, max: 72 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              sx={{ color: "#6846E5", marginBottom: 0.5 }}
                            >
                              px
                            </InputAdornment>
                          ),
                          disableUnderline: true,
                        }}
                        sx={{
                          width: 92,
                          "& .MuiInputBase-root": {
                            borderRadius: 1,
                            backgroundColor: "#EEF2FF",
                            height: "36px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#6846E5",
                            border: "none",
                            boxShadow: "none",
                            px: 1.25,
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Slider below, syncs as before */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "96%",
                    ml: 1,
                  }}
                >
                  <Controller
                    name="descriptionFontSize"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        min={8}
                        max={72}
                        value={field.value}
                        onChange={(_, val) => {
                          const numericValue = Array.isArray(val)
                            ? val[0]
                            : val;
                          field.onChange(numericValue);
                          markFormTouched();
                          dispatch(
                            updateTypographyField({
                              key: "descriptionFontSize",
                              value: numericValue,
                            })
                          );
                        }}
                        sx={{ flex: 1 }}
                      />
                    )}
                  />
                </Box>
              </Box>
              {/* Description Color */}
              <Box sx={{ mb: 1, ml: 1, width: "98%" }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                    fontWeight: "bold",
                    color: "#444D5C",
                  }}
                >
                  <ColorLensIcon style={{ color: "#752FEC" }} /> Color
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "96%",
                    height: "40px",
                    marginLeft: 2,
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
                            dispatch(
                              updateTypographyField({
                                key: "descriptionFontColor",
                                value: color,
                              })
                            );
                          }}
                        />
                        <TextField
                          type="text"
                          variant="standard"
                          value={field.value}
                          onChange={(e) => {
                            let input = e.target.value;

                            if (!input.startsWith("#")) {
                              input = `#${input.replace(/^#*/, "")}`;
                            }
                            field.onChange(input);
                            markFormTouched();
                            dispatch(
                              updateTypographyField({
                                key: "descriptionFontColor",
                                value: input,
                              })
                            );
                          }}
                          placeholder={field.value?.toUpperCase()}
                          InputProps={{
                            disableUnderline: true,
                          }}
                          sx={{
                            flex: 1,
                            "& .MuiInputBase-root": {
                              borderRadius: 1,
                              width: "80%",
                              height: "36px",
                              fontSize: "16px",
                              backgroundColor: "#EEF2FF",
                              fontWeight: "bold",
                              color: "#6846E5",
                              border: "none",
                              boxShadow: "none",
                              px: 1.25,
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
  );
};

export default ScreenTypographySettings;
