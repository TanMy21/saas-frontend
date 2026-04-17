import { Box, Button } from "@mui/material";

import { FeedbackPillsProps, FeedbackTypeUI } from "../../types/feedBackTypes";
import { FeedbackTypeStyles } from "../../utils/constants";

const FeebackPills = ({
  feedbackType,
  setFeedbackType,
  FeedBackPlaceholders,
}: FeedbackPillsProps) => {
  const feedbackTypes = Object.keys(FeedBackPlaceholders) as FeedbackTypeUI[];
  return (
    <Box
      sx={{ display: "flex", gap: 1, mb: 2, mt: 1,ml:0.5, flexWrap: "wrap" }}
    >
      {feedbackTypes.map((t) => {
        const style = FeedbackTypeStyles[t];

        return (
          <Button
            key={t}
            onClick={() => setFeedbackType(t)}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              px: 2,
              py: 0.5,
              fontSize: 14,
              fontWeight: 600,
              border: "1px solid",
              backgroundColor: feedbackType === t ? style.selectedBg : style.bg,
              color: feedbackType === t ? "#fff" : style.color,
              borderColor:
                feedbackType === t ? style.selectedBg : style.color + "33",
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor:
                  feedbackType === t ? style.selectedBg : style.hoverBg,
                borderColor: style.color,
              },
              "&:active": {
                transform: "scale(0.97)",
              },
            }}
          >
            {t}
          </Button>
        );
      })}
    </Box>
  );
};

export default FeebackPills;
