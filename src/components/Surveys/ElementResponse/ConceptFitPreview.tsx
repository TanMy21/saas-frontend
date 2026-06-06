import { Box, Typography } from "@mui/material";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { DEFAULT_TIMER_SECONDS, timerDrain } from "../../../utils/constants";

export const ConceptFitPreview = ({
  firstAttribute,
}: {
  firstAttribute?: string;
}) => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = question?.questionID;
  const uiConfig = question?.questionPreferences?.uiConfig || {};

  const timeLimitMs =
    questionID && typeof uiConfig.timeLimitMs === "number"
      ? uiConfig.timeLimitMs
      : DEFAULT_TIMER_SECONDS * 1000;

  const timeLimitSeconds = Math.round(timeLimitMs / 1000);

  return (
    <Box
      sx={{
        border: "1px solid #A5F3FC",
        bgcolor: "#ECFEFF",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#0E7490" }}>
          Concept fit preview
        </Typography>

        <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#0891B2" }}>
          {timeLimitSeconds}s
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            border: "1px solid #67E8F9",
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            p: 1.5,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 12, color: "#64748B", mb: 0.5 }}>
            E
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
            Fits
          </Typography>
        </Box>

        <Box
          sx={{
            minWidth: 130,
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            px: 2,
            py: 2,
            textAlign: "center",
            boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#0F172A" }}>
            {firstAttribute || "Premium"}
          </Typography>
        </Box>

        <Box
          sx={{
            border: "1px solid #67E8F9",
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            p: 1.5,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 12, color: "#64748B", mb: 0.5 }}>
            I
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
            Does not fit
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: 8,
          borderRadius: 999,
          bgcolor: "#CFFAFE",
          overflow: "hidden",
          mt: 1.5,
        }}
      >
        <Box
          key={timeLimitMs}
          sx={{
            width: "68%",
            height: "100%",
            borderRadius: 999,
            bgcolor: "#0891B2",
            animation: `${timerDrain} ${timeLimitMs}ms linear infinite`,
          }}
        />
      </Box>

      <Typography sx={{ mt: 1, fontSize: 12, color: "#0E7490" }}>
        Participants quickly decide whether each attribute fits the concept.
      </Typography>
    </Box>
  );
};
