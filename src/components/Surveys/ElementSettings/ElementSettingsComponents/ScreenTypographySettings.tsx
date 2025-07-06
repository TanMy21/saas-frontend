import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FiType } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

import {
  useUpdateElementTypographyMobileViewMutation,
  useUpdateElementTypographyMutation,
} from "../../../../app/slices/elementApiSlice";
import { updateTypographyField } from "../../../../app/slices/elementTypographySlice";
import { RootState } from "../../../../app/store";
import { TypographySettingsFormSchema } from "../../../../utils/schema";
import {
  ScreenTypographySettingsProps,
  TypographySettingsForm,
} from "../../../../utils/types";

import ColorPicker from "./ColorPicker";
import FontSizeControl from "./FontSizeControl";
import FontSizeViewToggle from "./FontSizeViewToggle";

const ScreenTypographySettings = ({ qID }: ScreenTypographySettingsProps) => {
  const [fontSizeView, setFontSizeView] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const typographySettings = useSelector(
    (state: RootState) => state.elementTypography
  );
  const dispatch = useDispatch();

  const isDesktop = fontSizeView === "desktop";
  const titleKey = (
    isDesktop ? "titleFontSize" : "titleFontSizeMobile"
  ) as keyof TypographySettingsForm;
  const descriptionKey = (
    isDesktop ? "descriptionFontSize" : "descriptionFontSizeMobile"
  ) as keyof TypographySettingsForm;
  const [updateElementTypography] = useUpdateElementTypographyMutation();
  const [updateElementTypographyMobileView] =
    useUpdateElementTypographyMobileViewMutation();

  const {
    titleFontColor,
    titleFontSize,
    titleFontSizeMobile,
    descriptionFontColor,
    descriptionFontSize,
    descriptionFontSizeMobile,
  } = typographySettings || {};

  const { handleSubmit, control, reset } = useForm<TypographySettingsForm>({
    resolver: zodResolver(TypographySettingsFormSchema),
    defaultValues: {
      titleFontSize,
      titleFontSizeMobile,
      titleFontColor,
      descriptionFontSize,
      descriptionFontSizeMobile,
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

  const onSubmitMobile = async (data: TypographySettingsForm) => {
    try {
      const { titleFontSizeMobile, descriptionFontSizeMobile } = data;

      await updateElementTypographyMobileView({
        questionID: qID,
        titleFontSizeMobile,
        descriptionFontSizeMobile,
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
      if (isDesktop) {
        handleSubmit(onSubmit)();
      } else {
        handleSubmit(onSubmitMobile)();
      }

      setFormTouched(false);
    }, 2500);
  }, [watchedValues, formTouched, handleSubmit]);

  useEffect(() => {
    reset({
      titleFontSize,
      titleFontSizeMobile,
      titleFontColor,
      descriptionFontSize,
      descriptionFontSizeMobile,
      descriptionFontColor,
    });
  }, [
    titleFontSize,
    titleFontSizeMobile,
    titleFontColor,
    descriptionFontSize,
    descriptionFontSizeMobile,
    descriptionFontColor,
    reset,
  ]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
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
        <AccordionDetails sx={{ px: { md: 2, xl: 1 }, pb: 2 }}>
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mb: 1,
                  ml: { md: 0, xl: 1 },
                  width: "96%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                    width: "100%",
                    // border: "2px solid blue",
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
                    <Box sx={{ display: { md: "none" } }}>
                      <FiType
                        style={{
                          marginBottom: "1%",
                          color: "#752FEC",
                        }}
                      />
                    </Box>
                    Font size
                  </Typography>
                  <Box>
                    <FontSizeViewToggle
                      view={fontSizeView}
                      setView={setFontSizeView}
                    />
                  </Box>
                </Box>
                <Box>
                  <FontSizeControl
                    key={titleKey}
                    name={titleKey}
                    dispatchKey={titleKey}
                    control={control}
                    markFormTouched={markFormTouched}
                  />
                </Box>
              </Box>
              {/* Text Color */}
              <Box sx={{ mb: 1, ml: 1, width: "96%" }}>
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
                    width: { md: "98%", xl: "96%" },
                    height: "40px",
                    marginLeft: { md: "2px", xl: 2 },
                    gap: 4,
                    // border: "2px solid blue",
                  }}
                >
                  <Controller
                    name="titleFontColor"
                    control={control}
                    render={({ field }) => (
                      <>
                        <ColorPicker
                          color={field.value!}
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
                              width: { md: "92%", xl: "80%" },
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mb: 1,
                  ml: { md: 0, xl: 1 },
                  width: "96%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                    width: "100%",
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
                    <Box sx={{ display: { md: "none" } }}>
                      <FiType
                        style={{ marginBottom: "1%", color: "#752FEC" }}
                      />
                    </Box>
                    Font size
                  </Typography>
                  <Box>
                    <FontSizeViewToggle
                      view={fontSizeView}
                      setView={setFontSizeView}
                    />
                  </Box>
                </Box>
                <Box>
                  <FontSizeControl
                    key={descriptionKey}
                    name={descriptionKey}
                    dispatchKey={descriptionKey}
                    control={control}
                    markFormTouched={markFormTouched}
                  />
                </Box>
              </Box>
              {/* Description Color */}
              <Box sx={{ mb: 1, ml: 1, width: "96%" }}>
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
                    width: { md: "98%", xl: "96%" },
                    height: "40px",
                    marginLeft: { md: "2px", xl: 2 },
                    gap: 4,
                  }}
                >
                  <Controller
                    name="descriptionFontColor"
                    control={control}
                    render={({ field }) => (
                      <>
                        <ColorPicker
                          color={field.value!}
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
                              width: { md: "92%", xl: "80%" },
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
