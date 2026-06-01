import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Palette } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FiType } from "react-icons/fi";

import {
  useUpdateElementTypographyMobileViewMutation,
  useUpdateElementTypographyMutation,
} from "../../../../app/slices/elementApiSlice";
import { updateTypographyField } from "../../../../app/slices/elementTypographySlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../../../context/BuilderRefetchCanvas";
import { usePermission } from "../../../../context/PermissionContext";
import { QuestionTextTypographySettingsFormSchema } from "../../../../utils/schema";
import {
  QuestionTextTypographySettingsForm,
  ScreenTypographySettingsProps,
} from "../../../../utils/types";

import ColorPicker from "./ColorPicker";
import FontSizeControl from "./FontSizeControl";
import FontSizeViewToggle from "./FontSizeViewToggle";

export const QuestionTextTypographySettings = ({
  qID,
}: ScreenTypographySettingsProps) => {
  const refetchCanvas = useSurveyCanvasRefetch();
  const { canEditQuestion } = usePermission();
  const [fontSizeView, setFontSizeView] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const typographySettings = useAppSelector(
    (state: RootState) => state.elementTypography,
  );
  const dispatch = useAppDispatch();

  const isDesktop = fontSizeView === "desktop";
  const titleKey = (
    isDesktop ? "titleFontSize" : "titleFontSizeMobile"
  ) as keyof QuestionTextTypographySettingsForm;

  const [updateElementTypography] = useUpdateElementTypographyMutation();
  const [updateElementTypographyMobileView] =
    useUpdateElementTypographyMobileViewMutation();

  const { titleTextColor, titleFontSize, titleFontSizeMobile } =
    typographySettings || {};

  const { handleSubmit, control, reset } =
    useForm<QuestionTextTypographySettingsForm>({
      resolver: zodResolver(QuestionTextTypographySettingsFormSchema),
      defaultValues: {
        titleFontSize: titleFontSize ?? undefined,
        titleFontSizeMobile: titleFontSizeMobile ?? undefined,
        titleTextColor: titleTextColor ?? undefined,
      },
    });

  const watchedTitleFontSizeValues = useWatch({
    control,
    name: "titleFontSize",
  });
  const watchedTitleFontSizeMobileValues = useWatch({
    control,
    name: "titleFontSizeMobile",
  });
  const watchedTitleTextColor = useWatch({ control, name: "titleTextColor" });

  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionTextTypographySettingsForm) => {
    if (!canEditQuestion) return;

    try {
      const { titleFontSize, titleTextColor } = data;

      await updateElementTypography({
        questionID: qID,
        titleFontSize,
        titleTextColor,
      }).unwrap();
      refetchCanvas();
      setFormTouched(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitMobile = async (data: QuestionTextTypographySettingsForm) => {
    if (!canEditQuestion) return;

    try {
      const { titleFontSizeMobile } = data;

      await updateElementTypographyMobileView({
        questionID: qID,
        titleFontSizeMobile,
      }).unwrap();
      setFormTouched(false);
    } catch (error) {
      console.error(error);
    }
  };

  const markFormTouched = () => {
    if (!canEditQuestion) return;
    if (!formTouched) {
      console.log("[markFormTouched] marked as true");
      setFormTouched(true);
    }
  };

  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      console.log("[useEffect] timeout fired → submitting form");
      handleSubmit(isDesktop ? onSubmit : onSubmitMobile, (errors) => {
        console.error("[handleSubmit] validation failed:", errors);
      })();

      setFormTouched(false);
    }, 2500);
  }, [
    watchedTitleFontSizeValues,
    watchedTitleFontSizeMobileValues,
    watchedTitleTextColor,
    formTouched,
    handleSubmit,
  ]);

  useEffect(() => {
    reset({
      titleFontSize: titleFontSize ?? undefined,
      titleFontSizeMobile: titleFontSizeMobile ?? undefined,
      titleTextColor: titleTextColor ?? undefined,
    });
  }, [titleFontSize, titleFontSizeMobile, titleTextColor, reset]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Accordion
        defaultExpanded={false}
        disableGutters
        elevation={0}
        square
        sx={{
          width: "100%",
          m: "0 !important",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E0E0E0",
          borderRadius: 0,
          boxShadow: "none",
          "&:before": { display: "none" },
          "&.Mui-expanded": {
            m: "0 !important",
          },
          "& .MuiAccordionSummary-root": {
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
          },
          "& .MuiAccordionSummary-root.Mui-expanded": {
            minHeight: 48,
          },

          "& .MuiAccordionSummary-content": {
            my: 1.5,
          },

          "& .MuiAccordionSummary-content.Mui-expanded": {
            my: 1.5,
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
              opacity: canEditQuestion ? 1 : 0.8,
              pointerEvents: canEditQuestion ? "auto" : "none",
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
                    canEdit={canEditQuestion}
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
                  <Palette style={{ color: "#752FEC" }} /> Color
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
                    name="titleTextColor"
                    control={control}
                    render={({ field }) => (
                      <>
                        <ColorPicker
                          color={field.value!}
                          canEdit={canEditQuestion}
                          setColor={(color: string) => {
                            if (!canEditQuestion) return;
                            field.onChange(color);
                            markFormTouched();
                            dispatch(
                              updateTypographyField({
                                key: "titleTextColor",
                                value: color,
                              }),
                            );
                          }}
                        />
                        <TextField
                          type="text"
                          variant="standard"
                          value={field.value}
                          disabled={!canEditQuestion}
                          onChange={(e) => {
                            let input = e.target.value;

                            if (!input.startsWith("#")) {
                              input = `#${input.replace(/^#*/, "")}`;
                            }
                            field.onChange(input);
                            markFormTouched();
                            dispatch(
                              updateTypographyField({
                                key: "titleTextColor",
                                value: input,
                              }),
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
