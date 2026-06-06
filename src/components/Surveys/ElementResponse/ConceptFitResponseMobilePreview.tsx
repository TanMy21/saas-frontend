import { useEffect, useMemo, useState } from "react";

import { Box, Button, Typography } from "@mui/material";
import { Check, Sparkles, Timer, X } from "lucide-react";

import { useGetOptionsOfQuestionQuery } from "../../../app/slices/optionApiSlice";
import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { OptionType } from "../../../utils/types";

const DEFAULT_TIMER_SECONDS = 8;

type ConceptFitAnswer = "fit" | "unfit";

export const ConceptFitResponseMobilePreview = () => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = question?.questionID;
  const uiConfig = question?.questionPreferences?.uiConfig || {};
 

  const timeLimitMs =
    typeof uiConfig.timeLimitMs === "number"
      ? uiConfig.timeLimitMs
      : DEFAULT_TIMER_SECONDS * 1000;

  const timeLimitSeconds = Math.max(1, Math.round(timeLimitMs / 1000));

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    questionID!,
    {
      skip: !questionID,
    },
  );

  const attributes = useMemo(() => options || [], [options]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ConceptFitAnswer>>({});
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [timerLeft, setTimerLeft] = useState(timeLimitSeconds);
  const [timerActive, setTimerActive] = useState(true);

  const currentAttribute = attributes[currentIndex];

  /**
   * Resets the mobile preview whenever options, selected question, or timer settings change.
   */
  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setGameEnded(false);
    setTimerLeft(timeLimitSeconds);
    setTimerActive(true);
  }, [questionID, options, timeLimitSeconds]);

  /**
   * Records a preview answer and moves to the next attribute.
   * Since builder attributes do not currently provide correctness, this only simulates the interaction.
   */
  const handleAnswer = (isMatchedPressed: boolean) => {
    if (gameEnded || !currentAttribute) return;

    setAnswers((prev) => ({
      ...prev,
      [currentAttribute.optionID]: isMatchedPressed ? "fit" : "unfit",
    }));

    // Preview-only score: count "Fits Well" taps as match score.
    if (isMatchedPressed) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex < attributes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimerLeft(timeLimitSeconds);
      return;
    }

    setGameEnded(true);
    setTimerActive(false);
  };

  /**
   * Runs the countdown for each active attribute card.
   * When time reaches zero, the preview treats it like a missed/mismatch tap.
   */
  useEffect(() => {
    if (gameEnded || !timerActive || attributes.length === 0) return;

    if (timerLeft <= 0) {
      handleAnswer(false);
      return;
    }

    const timer = window.setInterval(() => {
      setTimerLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timerLeft, gameEnded, timerActive, currentIndex, attributes.length]);

  const timerProgress = Math.max(
    0,
    Math.min(100, (timerLeft / timeLimitSeconds) * 100),
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 540,
        display: "flex",
        justifyContent: "center",
        mt: 2,
      }}
    >
      <Box
        sx={{
          width: "92%",
          minHeight: 540,
          p: 2,
          borderRadius: "28px",
          bgcolor: "#FFFFFF",
          background:
            "linear-gradient(180deg, rgba(250,245,255,0.85) 0%, #FFFFFF 42%, rgba(250,245,255,0.45) 100%)",
          border: "1px solid #E9D5FF",
          boxShadow: "0 18px 45px rgba(88,28,135,0.12)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 0.5,
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.25,
              py: 0.5,
              borderRadius: "999px",
              bgcolor: "#F3E8FF",
              color: "#7E22CE",
              border: "1px solid #E9D5FF",
            }}
          >
            <Sparkles size={13} />

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              Fit Challenge
            </Typography>
          </Box>

          {attributes.length > 0 && !gameEnded && (
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 900,
                color: "#64748B",
                bgcolor: "#F1F5F9",
                px: 1,
                py: 0.4,
                borderRadius: "8px",
              }}
            >
              {currentIndex + 1} / {attributes.length}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            my: 1,
          }}
        >
          {attributes.length === 0 ? (
            <Box
              sx={{
                width: "100%",
                minHeight: 190,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 3,
                color: "#94A3B8",
                border: "1px dashed #CBD5E1",
                borderRadius: "22px",
                bgcolor: "#F8FAFC",
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                Please define attributes in the builder first.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  mb: 1.5,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.5,
                  py: 0.65,
                  borderRadius: "999px",
                  fontSize: 12,
                  fontWeight: 900,
                  border: "1px solid",
                  bgcolor: timerLeft <= 2 ? "#FFF1F2" : "#FFFBEB",
                  borderColor: timerLeft <= 2 ? "#FFE4E6" : "#FEF3C7",
                  color: timerLeft <= 2 ? "#E11D48" : "#B45309",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
                  animation:
                    timerLeft <= 2 ? "pulseTimer 900ms infinite" : "none",
                  "@keyframes pulseTimer": {
                    "0%, 100%": {
                      transform: "scale(1)",
                    },
                    "50%": {
                      transform: "scale(1.04)",
                    },
                  },
                }}
              >
                <Timer size={15} />
                {timerLeft}s limit
              </Box>

              <Box
                sx={{
                  width: "100%",
                  minHeight: 150,
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: "#FFFFFF",
                  border: "2px dashed #D8B4FE",
                  borderRadius: "28px",
                  p: 3,
                  boxShadow: "0 12px 30px rgba(88,28,135,0.12)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 120ms ease",
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 900,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: 1.1,
                    mb: 1,
                  }}
                >
                  Attribute Association
                </Typography>

                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 950,
                    color: "#6B21A8",
                    lineHeight: 1.25,
                    px: 1,
                  }}
                >
                  {currentAttribute?.text || "Untitled Attribute"}
                </Typography>

                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 6,
                    width: `${timerProgress}%`,
                    bgcolor: timerLeft <= 2 ? "#E11D48" : "#A855F7",
                    transition:
                      "width 1000ms linear, background-color 200ms ease",
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {!gameEnded && attributes.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              pt: 1.5,
            }}
          >
            <Button
              onClick={() => handleAnswer(false)}
              sx={{
                py: 1.4,
                borderRadius: "18px",
                bgcolor: "#FFF1F2",
                color: "#BE123C",
                border: "1px solid #FFE4E6",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                textTransform: "none",
                boxShadow: "0 6px 14px rgba(190,18,60,0.08)",
                "&:hover": {
                  bgcolor: "#FFE4E6",
                },
                "&:active": {
                  transform: "scale(0.96)",
                },
              }}
            >
              <X size={21} strokeWidth={2.7} />

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Mismatch
              </Typography>
            </Button>

            <Button
              onClick={() => handleAnswer(true)}
              sx={{
                py: 1.4,
                borderRadius: "18px",
                bgcolor: "#ECFDF5",
                color: "#047857",
                border: "1px solid #D1FAE5",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                textTransform: "none",
                boxShadow: "0 6px 14px rgba(4,120,87,0.08)",
                "&:hover": {
                  bgcolor: "#D1FAE5",
                },
                "&:active": {
                  transform: "scale(0.96)",
                },
              }}
            >
              <Check size={21} strokeWidth={2.7} />

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Fits Well
              </Typography>
            </Button>
          </Box>
        )}

        {!gameEnded && (
          <Typography
            sx={{
              fontSize: 10,
              color: "#94A3B8",
              textAlign: "center",
              mt: 1.25,
              fontWeight: 600,
            }}
          >
            Is the word compatible with the target concept? Tap to sort.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
