import { Button, CircularProgress, Tooltip } from "@mui/material";
import { Share2 } from "lucide-react";

import { openShareModal } from "../../app/slices/overlaySlice";
import { usePublishSurveyMutation } from "../../app/slices/surveysApiSlice";
import { useAppDispatch } from "../../app/store";
import { useSurveyCanvasRefetch } from "../../context/BuilderRefetchCanvas";
import { PublishButtonProps } from "../../utils/types";

const ShareButton = ({ surveyID, published }: PublishButtonProps) => {
  const refetchCanvas = useSurveyCanvasRefetch();
  const dispatch = useAppDispatch();
  const [publishSurvey, { isLoading }] = usePublishSurveyMutation();

  const handleShare = async () => {
    try {
      if (!published) {
        await publishSurvey({
          surveyID,
          published: true,
        }).unwrap();

        refetchCanvas();
      }

      dispatch(openShareModal());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Tooltip title={published ? "Share survey" : "Publish & share"}>
      <Button
        onClick={handleShare}
        variant="contained"
        disabled={isLoading}
        sx={{
          backgroundColor: "#7c3aed",
          color: "#ffffff",
          borderRadius: "20px",
          px: 2,
          py: 1.2,
          minWidth: "auto", // 🔥 important for icon-only
          boxShadow: "0 2px 6px rgba(124,58,237,0.2)",
          marginRight: 8,
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: "#6d28d9",
            boxShadow: "0 2px 16px rgba(124,58,237,0.1)",
            transform: "translateY(-1px)",
          },

          "&:active": {
            transform: "translateY(0px) scale(0.97)",
            boxShadow: "0 2px 6px rgba(124,58,237,0.2)",
          },

          "&:disabled": {
            backgroundColor: "#c4b5fd",
            color: "#ffffff",
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <Share2 size={18} />
        )}
      </Button>
    </Tooltip>
  );
};

export default ShareButton;
