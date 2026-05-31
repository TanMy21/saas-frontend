import { Box, Typography } from "@mui/material";

import { DEFAULT_TIMER_SECONDS } from "../../../utils/constants";

export const TimedChoiceTimerPreview = () => {
  return (
    <Box
      sx={{
        width: "100%",
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
          {DEFAULT_TIMER_SECONDS}s
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
          sx={{
            width: "72%",
            height: "100%",
            borderRadius: 999,
            bgcolor: "#EA580C",
          }}
        />
      </Box>

      <Typography sx={{ mt: 1, fontSize: 12, color: "#9A3412" }}>
        Participants will choose quickly before the timer ends.
      </Typography>
    </Box>
  );
};
