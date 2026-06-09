import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Tooltip,
  Typography,
} from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { FiType } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

import {
  useUpdateElementTypographyMobileViewMutation,
  useUpdateElementTypographyMutation,
} from "../../../../app/slices/elementApiSlice";
import { RootState } from "../../../../app/store";
import { useSurveyCanvasRefetch } from "../../../../context/BuilderRefetchCanvas";
import { usePermission } from "../../../../context/PermissionContext";
import { TypographySettingsFormSchema } from "../../../../utils/schema";
import {
  ScreenTypographySettingsProps,
  TypographySettingsForm,
} from "../../../../utils/types";

import FontSizeControl from "./FontSizeControl";
import FontSizeViewToggle from "./FontSizeViewToggle";
import SettingSaveStatus from "./SettingSaveStatus";

const ScreenTypographySettings = ({ qID }: ScreenTypographySettingsProps) => {
  const refetchCanvas = useSurveyCanvasRefetch();
  const { canEditQuestion } = usePermission();

  const [fontSizeView, setFontSizeView] = useState<"desktop" | "mobile">(
    "desktop",
  );

  const typographySettings = useSelector(
    (state: RootState) => state.elementTypography,
  );

  const dispatch = useDispatch();

  const isDesktop = fontSizeView === "desktop";

  const titleKey = (
    isDesktop ? "titleFontSize" : "titleFontSizeMobile"
  ) as keyof TypographySettingsForm;

  const descriptionKey = (
    isDesktop ? "descriptionFontSize" : "descriptionFontSizeMobile"
  ) as keyof TypographySettingsForm;

  const [updateElementTypography, { isLoading: isSavingDesktopTypography }] =
    useUpdateElementTypographyMutation();

  const [
    updateElementTypographyMobileView,
    { isLoading: isSavingMobileTypography },
  ] = useUpdateElementTypographyMobileViewMutation();

  const [saveStatus, setSaveStatus] = useState<SettingSaveState>("idle");

  const {
    titleTextColor,
    titleFontSize,
    titleFontSizeMobile,
    descriptionTextColor,
    descriptionFontSize,
    descriptionFontSizeMobile,
  } = typographySettings || {};

  const { handleSubmit, control, reset } = useForm<TypographySettingsForm>({
    resolver: zodResolver(TypographySettingsFormSchema),
    defaultValues: {
      titleFontSize: titleFontSize ?? undefined,
      titleFontSizeMobile: titleFontSizeMobile ?? undefined,
      titleTextColor: titleTextColor ?? undefined,
      descriptionFontSize: descriptionFontSize ?? undefined,
      descriptionFontSizeMobile: descriptionFontSizeMobile ?? undefined,
      descriptionTextColor: descriptionTextColor ?? undefined,
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

  const watchedTitleTextColor = useWatch({
    control,
    name: "titleTextColor",
  });

  const watchedDescriptionFontValues = useWatch({
    control,
    name: "descriptionFontSize",
  });

  const watchedDescriptionFontMobileValues = useWatch({
    control,
    name: "descriptionFontSizeMobile",
  });

  const watchedDescriptionTextColor = useWatch({
    control,
    name: "descriptionTextColor",
  });

  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSavingTypography =
    isSavingDesktopTypography || isSavingMobileTypography;

  /**
   * Stores the last confirmed saved typography settings.
   * This prevents Redux live-preview changes from being treated as backend-saved values.
   */
  const lastSavedTypographyRef = useRef<TypographySettingsForm>({
    titleFontSize: titleFontSize ?? undefined,
    titleFontSizeMobile: titleFontSizeMobile ?? undefined,
    titleTextColor: titleTextColor ?? undefined,
    descriptionFontSize: descriptionFontSize ?? undefined,
    descriptionFontSizeMobile: descriptionFontSizeMobile ?? undefined,
    descriptionTextColor: descriptionTextColor ?? undefined,
  });

  /**
   * Tracks the selected question.
   * This prevents reset/status flicker while editing the same question.
   */
  const activeQuestionIDRef = useRef<string | undefined>(undefined);

  /**
   * Checks if desktop typography values actually changed from the last saved baseline.
   */
  const hasActualDesktopTypographyChange = (data: TypographySettingsForm) => {
    const lastSaved = lastSavedTypographyRef.current;

    return (
      data.titleFontSize !== lastSaved.titleFontSize ||
      data.titleTextColor !== lastSaved.titleTextColor ||
      data.descriptionFontSize !== lastSaved.descriptionFontSize ||
      data.descriptionTextColor !== lastSaved.descriptionTextColor
    );
  };

  /**
   * Checks if mobile typography values actually changed from the last saved baseline.
   */
  const hasActualMobileTypographyChange = (data: TypographySettingsForm) => {
    const lastSaved = lastSavedTypographyRef.current;

    return (
      data.titleFontSizeMobile !== lastSaved.titleFontSizeMobile ||
      data.descriptionFontSizeMobile !== lastSaved.descriptionFontSizeMobile
    );
  };

  /**
   * Saves desktop typography settings only when there is an actual change.
   */
  const onSubmit = async (data: TypographySettingsForm) => {
    if (!canEditQuestion) return;

    if (!hasActualDesktopTypographyChange(data)) {
      setFormTouched(false);
      setSaveStatus("idle");
      return;
    }

    try {
      setSaveStatus("saving");

      const {
        titleFontSize,
        titleTextColor,
        descriptionTextColor,
        descriptionFontSize,
      } = data;

      await updateElementTypography({
        questionID: qID,
        titleFontSize,
        titleTextColor,
        descriptionTextColor,
        descriptionFontSize,
      }).unwrap();

      /**
       * Update only the desktop saved baseline after backend success.
       */
      lastSavedTypographyRef.current = {
        ...lastSavedTypographyRef.current,
        titleFontSize,
        titleTextColor,
        descriptionFontSize,
        descriptionTextColor,
      };

      refetchCanvas();
      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Typography desktop settings update error:", error);
      setFormTouched(false);
      setSaveStatus("error");
    }
  };

  /**
   * Saves mobile typography settings only when there is an actual change.
   */
  const onSubmitMobile = async (data: TypographySettingsForm) => {
    if (!canEditQuestion) return;

    if (!hasActualMobileTypographyChange(data)) {
      setFormTouched(false);
      setSaveStatus("idle");
      return;
    }

    try {
      setSaveStatus("saving");

      const { titleFontSizeMobile, descriptionFontSizeMobile } = data;

      await updateElementTypographyMobileView({
        questionID: qID,
        titleFontSizeMobile,
        descriptionFontSizeMobile,
      }).unwrap();

      /**
       * Update only the mobile saved baseline after backend success.
       */
      lastSavedTypographyRef.current = {
        ...lastSavedTypographyRef.current,
        titleFontSizeMobile,
        descriptionFontSizeMobile,
      };

      refetchCanvas();
      setFormTouched(false);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Typography mobile settings update error:", error);
      setFormTouched(false);
      setSaveStatus("error");
    }
  };

  /**
   * Marks the form as dirty only after user interaction.
   * This keeps the save indicator hidden on initial render.
   */
  const markFormTouched = () => {
    if (!canEditQuestion) return;

    if (!formTouched) {
      setFormTouched(true);
    }

    setSaveStatus("dirty");
  };

  /**
   * Debounces typography saves.
   * Desktop and mobile saves are routed to different endpoints based on the active view.
   */
  useEffect(() => {
    if (!formTouched || !canEditQuestion) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(isDesktop ? onSubmit : onSubmitMobile, (errors) => {
        console.error("[Typography settings validation failed]:", errors);
        setFormTouched(false);
        setSaveStatus("error");
      })();
    }, 2500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [
    watchedTitleFontSizeValues,
    watchedTitleFontSizeMobileValues,
    watchedTitleTextColor,
    watchedDescriptionFontValues,
    watchedDescriptionFontMobileValues,
    watchedDescriptionTextColor,
    formTouched,
    canEditQuestion,
    isDesktop,
    handleSubmit,
  ]);

  /**
   * Hydrates RHF values only when the selected question changes.
   * This prevents Redux live-preview updates from hiding the save indicator while editing.
   */
  useEffect(() => {
    if (!qID) return;

    if (activeQuestionIDRef.current === qID) return;

    activeQuestionIDRef.current = qID;

    const nextValues: TypographySettingsForm = {
      titleFontSize: titleFontSize ?? undefined,
      titleFontSizeMobile: titleFontSizeMobile ?? undefined,
      titleTextColor: titleTextColor ?? undefined,
      descriptionFontSize: descriptionFontSize ?? undefined,
      descriptionFontSizeMobile: descriptionFontSizeMobile ?? undefined,
      descriptionTextColor: descriptionTextColor ?? undefined,
    };

    lastSavedTypographyRef.current = nextValues;

    reset(nextValues);

    setFormTouched(false);
    setSaveStatus("idle");
  }, [
    qID,
    titleFontSize,
    titleFontSizeMobile,
    titleTextColor,
    descriptionFontSize,
    descriptionFontSizeMobile,
    descriptionTextColor,
    reset,
  ]);

  /**
   * Clears pending debounce when the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

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
          borderBottom: "1px solid #E0E0E0",
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
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="#444D5C"
                sx={{ mb: 2, borderBottom: "1px solid #E0E0E0" }}
              >
                Title
              </Typography>

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
            </Box>

            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="#444D5C"
                sx={{ mb: 2, borderBottom: "1px solid #E0E0E0" }}
              >
                Description
              </Typography>

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
                    key={descriptionKey}
                    name={descriptionKey}
                    dispatchKey={descriptionKey}
                    control={control}
                    canEdit={canEditQuestion}
                    markFormTouched={markFormTouched}
                  />
                </Box>
              </Box>
            </Box>

            {saveStatus !== "idle" && (
              <Box sx={{ mt: 1.5 }}>
                <SettingSaveStatus
                  state={isSavingTypography ? "saving" : saveStatus}
                />
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </form>
  );
};

export default ScreenTypographySettings;
