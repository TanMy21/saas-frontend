import { Box, Button } from "@mui/material";
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
    <Button
      onClick={handleShare}
      variant="contained"
      disabled={isLoading}
      sx={{
        backgroundColor: "#2563eb",
        color: "#ffffff",
        borderRadius: "20px",
        fontWeight: 600,
        textTransform: "none",
        px: 2.5,
        py: 0.8,
        boxShadow: "0 2px 6px rgba(37,99,235,0.15)",
        marginRight: "16%",
        "&:hover": {
          backgroundColor: "#1d4ed8", // blue-700
          boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
        },
        "&:active": {
          backgroundColor: "#1e40af", // blue-800
        },
        "&:disabled": {
          backgroundColor: "#93c5fd",
          color: "#ffffff",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box mt={0.5}>
          <Share2 size={16} />
        </Box>
        {isLoading ? "Preparing..." : "Share"}
      </Box>
    </Button>
  );
};

export default ShareButton;
