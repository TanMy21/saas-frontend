import { useEffect, useState } from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { DEFAULT_TIMER_SECONDS } from "../../../utils/constants";
import { ElementProps } from "../../../utils/types";

export const TimedChoiceTimerPreview = ({ qID }: Pick<ElementProps, "qID">) => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = qID || question?.questionID;
  const uiConfig = question?.questionPreferences?.uiConfig || {};

  const timeLimitMs =
    question?.questionID === questionID &&
    typeof uiConfig.timeLimitMs === "number"
      ? uiConfig.timeLimitMs
      : DEFAULT_TIMER_SECONDS * 1000;

  const timeLimitSeconds = Math.max(1, Math.round(timeLimitMs / 1000));

  const [secondsLeft, setSecondsLeft] = useState(timeLimitSeconds);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setSecondsLeft(timeLimitSeconds);
    setProgress(100);

    let startedAt = Date.now();

    const intervalID = window.setInterval(() => {
      const elapsedMs = Date.now() - startedAt;

      if (elapsedMs >= timeLimitMs) {
        startedAt = Date.now();
        setSecondsLeft(timeLimitSeconds);
        setProgress(100);
        return;
      }

      const remainingMs = Math.max(0, timeLimitMs - elapsedMs);
      const nextSecondsLeft = Math.max(1, Math.ceil(remainingMs / 1000));
      const nextProgress = Math.max(0, (remainingMs / timeLimitMs) * 100);

      setSecondsLeft(nextSecondsLeft);
      setProgress(nextProgress);
    }, 80);

    return () => {
      window.clearInterval(intervalID);
    };
  }, [timeLimitMs, timeLimitSeconds]);

  return (
    <Box
      sx={{
        width: "90%",
        mx: "auto",
        px: 1.5,
        py: 1,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 38,
          height: 38,
          borderRadius: "50%",
          bgcolor: "#FFF7ED",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // boxShadow: "0 6px 16px rgba(234, 88, 12, 0.12)",
        }}
      >
        <CircularProgress
          variant="determinate"
          value={100}
          size={38}
          thickness={4.2}
          sx={{
            position: "absolute",
            color: "#FFEDD5",
          }}
        />

        <CircularProgress
          variant="determinate"
          value={progress}
          size={38}
          thickness={4.2}
          sx={{
            position: "absolute",
            color: "#EA580C",
            transform: "rotate(-90deg)",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
              transition: "stroke-dashoffset 80ms linear",
            },
          }}
        />

        <Box
          sx={{
            width: 27,
            height: 27,
            borderRadius: "50%",
            bgcolor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            boxShadow: "inset 0 0 0 1px #FED7AA",
          }}
        >
          <Typography
            sx={{
              fontSize: secondsLeft >= 10 ? 10.5 : 12,
              fontWeight: 900,
              color: "#EA580C",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {secondsLeft}s
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};