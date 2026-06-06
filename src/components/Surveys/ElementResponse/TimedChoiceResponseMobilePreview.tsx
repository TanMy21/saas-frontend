import { Box, Typography } from "@mui/material";

import { useGetOptionsOfQuestionQuery } from "../../../app/slices/optionApiSlice";
import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import {
  MobileShellProps,
  TimedChoiceMobileOptionCardProps,
  TimerPreviewProps,
} from "../../../types/surveyBuilderTypes";
import {
  DEFAULT_TIMER_SECONDS,
  TIMED_ACCENT,
  TIMED_CHOICE_IMAGE_ROLES,
} from "../../../utils/constants";
import { OptionType } from "../../../utils/types";

export function TimerPreview({
  seconds,
  accent = "#7C3AED",
  label = "Time",
}: TimerPreviewProps) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        px: 2,
        py: 0.75,
        borderRadius: "999px",
        backgroundColor: `${accent}15`,
        color: accent,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        alignSelf: "center",
      }}
    >
      <Typography
        component="span"
        sx={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.4,
          color:TIMED_ACCENT,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>

      <Typography
        component="span"
        sx={{
          fontSize: 16,
          fontWeight: 900,
          color: TIMED_ACCENT,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {seconds}s
      </Typography>
    </Box>
  );
}

export function MobileShell({
  children,
  accent = "#F97316",
}: MobileShellProps) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 2,
      }}
    >
      <Box
        sx={{
          width: "92%",
          minHeight: 520,
          borderRadius: "28px",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          background: `linear-gradient(180deg, ${accent}12 0%, #FFFFFF 42%, #F8FAFC 100%)`,
          border: "1px solid #E2E8F0",
          boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function TimedChoiceMobileOptionCard({
  option,
  imageUrl,
  displayMode,
}: TimedChoiceMobileOptionCardProps) {
  const showImage = displayMode === "IMAGE" && Boolean(imageUrl);

  return (
    <Box
      role="button"
      tabIndex={0}
      sx={{
        flex: 1,
        minHeight: 150,
        borderRadius: "22px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #F1F5F9",
        boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 14px 34px rgba(249,115,22,0.18)",
        },
        "&:focus-visible": {
          outline: "3px solid rgba(249,115,22,0.35)",
          outlineOffset: 3,
        },
      }}
    >
      {showImage ? (
        <>
          <Box
            component="img"
            src={imageUrl!}
            alt={option.text}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: 12,
              px: 1.5,
              py: 1,
              borderRadius: "14px",
              bgcolor: "rgba(15,23,42,0.72)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.24)",
            }}
          >
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 900,
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              {option.text}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography
          sx={{
            fontSize: 25,
            fontWeight: 900,
            color: "#0F172A",
            textAlign: "center",
            px: 2,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
          }}
        >
          {option.text}
        </Typography>
      )}
    </Box>
  );
}

export function TimedChoiceResponseMobilePreview() {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );
  const questionID = question?.questionID;
  const uiConfig = question?.questionPreferences?.uiConfig || {};

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    questionID!,
  );

  const timeLimitMs =
    question?.questionID === questionID &&
    typeof uiConfig.timeLimitMs === "number"
      ? uiConfig.timeLimitMs
      : DEFAULT_TIMER_SECONDS * 1000;

  const timeLimitSeconds = Math.round(timeLimitMs / 1000);
  const questionImages = question?.questionImages || [];
  const timedChoiceDisplayMode =
    question?.questionPreferences?.uiConfig?.timedChoiceDisplayMode ?? "TEXT";

  const visibleOptions = options.slice(0, 2);

  return (
    <MobileShell accent={TIMED_ACCENT}>
      <TimerPreview
        seconds={timeLimitSeconds}
        accent={TIMED_ACCENT}
        label="React in"
      />

      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 900,
          textAlign: "center",
          color: "#0F172A",
          letterSpacing: "-0.03em",
        }}
      >
        Pick one — fast!
      </Typography>

  

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          flex: 1,
          mt: 1,
        }}
      >
        {visibleOptions.length > 0 ? (
          visibleOptions.map((option, index) => {
            // Option A maps to LEFT image, Option B maps to RIGHT image.
            const imageRole =
              index === 0
                ? TIMED_CHOICE_IMAGE_ROLES.LEFT
                : TIMED_CHOICE_IMAGE_ROLES.RIGHT;

            // Finds the image assigned to this option side.
            const optionImage = questionImages.find(
              (image) => image.role === imageRole,
            );

            return (
              <TimedChoiceMobileOptionCard
                key={option.optionID}
                option={option}
                imageUrl={optionImage?.imageUrl}
                displayMode={timedChoiceDisplayMode}
              />
            );
          })
        ) : (
          <Box
            sx={{
              flex: 1,
              minHeight: 260,
              borderRadius: "22px",
              border: "1px dashed #FDBA74",
              bgcolor: "#FFF7ED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
                color: "#C2410C",
                textAlign: "center",
              }}
            >
              Add 2 options to preview the mobile timed choice.
            </Typography>
          </Box>
        )}
      </Box>
    </MobileShell>
  );
}
