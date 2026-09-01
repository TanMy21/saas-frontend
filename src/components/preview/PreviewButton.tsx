import { IconButton, Tooltip } from "@mui/material";
import { Eye } from "lucide-react";

type PreviewButtonProps = {
  surveyID?: string;
};

const PreviewButton = ({ surveyID }: PreviewButtonProps) => {
  const openPreview = () => {
    if (!surveyID) return;

    window.open(
      `/survey/${encodeURIComponent(surveyID)}/preview`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Tooltip title="Preview survey">
      <span>
        <IconButton
          onClick={openPreview}
          disabled={!surveyID}
          aria-label="Preview survey"
          sx={{
            mr: 2,
            p: 1.2,
            color: "#1B1A1A",
            backgroundColor: "transparent",
            transition: "transform 150ms ease, color 150ms ease",
            "&:hover": {
              color: "#005BC4",
              backgroundColor: "transparent",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0) scale(0.97)",
            },
          }}
        >
          <Eye size={24} />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default PreviewButton;
