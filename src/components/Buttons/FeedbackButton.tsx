import { Button } from "@mui/material";
import { MessageSquarePlus } from "lucide-react";

import { openFeedbackModal } from "../../app/slices/feedbackSlice";
import { useAppDispatch } from "../../app/typedReduxHooks";

const FeedbackButton = () => {
  const dispatch = useAppDispatch();
  return (
    <Button
      onClick={() => dispatch(openFeedbackModal())}
      sx={{
        textTransform: "none",
        borderRadius: "999px",
        px: 2,
        py: 0.6,
        fontSize: "13px",
        // border: "1px solid #e5e7eb",
        backgroundColor: "#fff",
        color: "#374151",
        minWidth: "auto",
        transition: "all 0.15s ease",
        "&:hover": {
          backgroundColor: "#f9fafb",
          borderColor: "#d1d5db",
        },
      }}
    >
      <MessageSquarePlus />
    </Button>
  );
};

export default FeedbackButton;
