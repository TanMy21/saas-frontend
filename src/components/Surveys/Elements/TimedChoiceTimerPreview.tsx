import { Box, Typography } from "@mui/material";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { DEFAULT_TIMER_SECONDS, timerDrain } from "../../../utils/constants";
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

  const timeLimitSeconds = Math.round(timeLimitMs / 1000);

  return (
    <Box
      sx={{
        width: "80%",
        mx: "auto",
        border: "1px solid #FED7AA",
        bgcolor: "#FFF7ED",
        borderRadius: 2,
        px: 2,
        py: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#9A3412" }}>
          Timed choice preview
        </Typography>

        <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#EA580C" }}>
          {timeLimitSeconds}s
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: 8,
          borderRadius: 999,
          bgcolor: "#FFEDD5",
          overflow: "hidden",
        }}
      >
        <Box
          key={timeLimitMs}
          sx={{
            height: "100%",
            borderRadius: 999,
            bgcolor: "#EA580C",

            /**
             * Animates based on actual stored timer duration.
             * key={timeLimitMs} restarts animation when creator changes time.
             */
            animation: `${timerDrain} ${timeLimitMs}ms linear infinite`,
          }}
        />
      </Box>

      <Typography sx={{ mt: 1, fontSize: 12, color: "#9A3412" }}>
        Participants will choose quickly before the timer ends.
      </Typography>
    </Box>
  );
};
