import { Button } from "@mui/material";

import { usePublishSurveyMutation } from "../../app/slices/surveysApiSlice";
import { useSurveyCanvasRefetch } from "../../context/BuilderRefetchCanvas";
import { PublishButtonProps } from "../../utils/types";

const PublishButton = ({ surveyID, published }: PublishButtonProps) => {
  const refetchCanvas = useSurveyCanvasRefetch();
  const [publishSurvey, { isLoading }] = usePublishSurveyMutation();
  console.log("Publishe: ", published);
  const handlePublish = async () => {
    try {
      await publishSurvey({
        surveyID,
        published: !published,
      });
      refetchCanvas();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handlePublish}
      variant="contained"
      sx={{
        backgroundColor: published ? "#e5e7eb" : "#22c55e",
        color: published ? "#ea580c" : "#fff",
        borderRadius: "20px",
        fontWeight: 600,
        textTransform: "none",
        boxShadow: "0 2px 8px 0 rgba(34,197,94,0.09)",
        marginRight: "16%",
        "&:hover": {
          backgroundColor: published ? "#e5e7eb" : "#16a34a",
          boxShadow: "0 4px 12px 0 rgba(34,197,94,0.16)",
        },
        "&:active": {
          backgroundColor: published ? "#d1d5db" : "#15803d",
        },
        "&:focus-visible": {
          backgroundColor: published ? "#d1d5db" : "#16a34a",
          outline: published ? "2px solid #ea580c" : "2px solid #16a34a",
          outlineOffset: "2px",
        },
      }}
    >
      {isLoading
        ? published
          ? "Unpublishing..."
          : "Publishing..."
        : published
          ? "Unpublish"
          : "Publish"}
    </Button>
  );
};

export default PublishButton;
