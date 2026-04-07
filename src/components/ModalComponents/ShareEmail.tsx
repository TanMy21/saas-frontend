import { Box, Typography } from "@mui/material";
import { CheckIcon, CopyIcon, LinkIcon } from "lucide-react";

import { useBatchedTracking } from "../../hooks/useBatchedTracking";
import { useShareCopyHandler } from "../../hooks/useShareCopyHandler";
import { useTrackedEvent } from "../../hooks/useTrackedEvent";
import { ShareTabProps } from "../../types/surveyBuilderTypes";
import { getSurveyEmailTemplate } from "../../utils/emailTemplate";
import { copyRichTextToClipboard } from "../../utils/utils";

const ShareEmail = ({
  title,
  shareURL,
  surveyID,
  setOpenSnackbar,
  trackShareEvent,
}: ShareTabProps) => {
   const batchedTrack = useBatchedTracking(trackShareEvent, surveyID!);
 const track = useTrackedEvent(batchedTrack, surveyID!);

  const { copied, copy, triggerCopied } = useShareCopyHandler(
    setOpenSnackbar,
    track,
  );

  const handleCopyTemplate = async () => {
    const html = getSurveyEmailTemplate({
      surveyTitle: title,
      shareURL,
      senderName: "<Your Name>",
    });

    await copyRichTextToClipboard(html);

    triggerCopied("template");

    track("SHARE_EMAIL_TEMPLATE_COPIED");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        onClick={handleCopyTemplate}
        sx={{
          position: "relative",
          p: 2.5,
          border: "1px solid #E5E7EB",
          borderRadius: 2.5,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#6366F1",
            bgcolor: "#F8FAFF",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        {/* Top-right icon */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: copied === "template" ? "success.main" : "#9CA3AF",
          }}
        >
          {copied === "template" ? (
            <CheckIcon size={20} />
          ) : (
            <CopyIcon size={20} />
          )}
        </Box>

        {/* Content */}
        <Typography fontWeight={600} mb={0.5}>
          Email Template
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Copy a ready-to-send email with your survey link
        </Typography>
      </Box>

      {/* Survey Link Card */}
      <Box
        onClick={() => copy(shareURL, "email_link", "SHARE_LINK_COPIED")}
        sx={{
          position: "relative",
          p: 2.5,
          border: "1px solid #E5E7EB",
          borderRadius: 2.5,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#6366F1",
            bgcolor: "#F8FAFF",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        {/* Top-right icon */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: copied === "email_link" ? "success.main" : "#9CA3AF",
          }}
        >
          {copied === "email_link" ? (
            <CheckIcon size={20} />
          ) : (
            <LinkIcon size={20} />
          )}
        </Box>

        {/* Content */}
        <Typography fontWeight={600} mb={0.5}>
          Survey Link
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Copy just the link to share anywhere
        </Typography>
      </Box>
    </Box>
  );
};

export default ShareEmail;
